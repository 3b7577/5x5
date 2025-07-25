use anyhow::{Ok, Result};
use dotenvy::from_path;
use indicatif::{ProgressBar, ProgressStyle};
use postgres::{
    Client, NoTls,
    binary_copy::BinaryCopyInWriter,
    types::{ToSql, Type},
};
use rayon::prelude::*;
use std::{env, path::PathBuf};
use thousands::Separable;

fn main() -> Result<()> {
    let env_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../.env");
    from_path(env_path).expect("Failed to load .env from root");
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set");

    let mut client = Client::connect(&db_url, NoTls)?;

    client.execute("DROP TABLE IF EXISTS bw25", &[])?;
    client.execute(
        "
        CREATE TABLE bw25 (
            img_bits   BIGINT PRIMARY KEY,
            tag_bits   BIGINT NOT NULL,
            black_cnt  SMALLINT NOT NULL
        );
    ",
        &[],
    )?;

    let sink =
        client.copy_in("COPY bw25 (img_bits, tag_bits, black_cnt) FROM STDIN (FORMAT binary)")?;

    let col_types = &[Type::INT8, Type::INT8, Type::INT2];
    let mut writer = BinaryCopyInWriter::new(sink, col_types);

    eprintln!("generating in parallel...");

    let total_count = 1u64 << 25;
    let pb = ProgressBar::new(total_count);
    pb.set_style(
        ProgressStyle::with_template("[{elapsed_precise}] [{wide_bar}] {pos}/{len} ({eta})")
            .unwrap()
            .progress_chars("█▉▊▋▌▍▎▏ "),
    );

    let t_gen = std::time::Instant::now();
    let all_rows: Vec<(i64, i64, i16)> = (0u32..(1 << 25))
        .into_par_iter()
        .filter_map(|img_bits| {
            let analyzed_image = generator::analyze(img_bits);
            pb.inc(1);

            if analyzed_image.tags.is_empty() {
                None
            } else {
                Some((
                    img_bits as i64,
                    analyzed_image.tags.bits() as i64,
                    analyzed_image.black_cnt as i16,
                ))
            }
        })
        .collect();

    pb.finish();
    eprintln!("generation and analysis took {:?}", t_gen.elapsed());

    eprintln!("streaming {} rows to db...", all_rows.len());
    let t_stream = std::time::Instant::now();
    let pb_db = ProgressBar::new(all_rows.len() as u64);
    pb_db.set_style(
        ProgressStyle::with_template("[{elapsed_precise}] [{wide_bar}] {pos}/{len} ({eta})")
            .unwrap()
            .progress_chars("█▉▊▋▌▍▎▏ "),
    );

    for (img_bits, tag_bits, black_cnt) in &all_rows {
        let row: [&(dyn ToSql + Sync); 3] = [img_bits, tag_bits, black_cnt];
        writer.write(&row)?;
        pb_db.inc(1);
    }

    let total: u64 = writer.finish()?;

    pb_db.finish();
    eprintln!(
        "done - {} rows copied to db in {:?}",
        total.separate_with_commas(),
        t_stream.elapsed()
    );

    client.batch_execute("ANALYZE bw25;")?;
    eprintln!("analyze complete");

    Ok(())
}

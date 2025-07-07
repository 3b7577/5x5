use anyhow::{Ok, Result};
use dotenvy::from_path;
use postgres::{
    Client, NoTls,
    binary_copy::BinaryCopyInWriter,
    types::{ToSql, Type},
};
use rayon::prelude::*;
use std::{
    env,
    path::PathBuf,
    sync::atomic::{AtomicU64, Ordering},
};
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
            img_bits   BIGINT NOT NULL,
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

    let counter = AtomicU64::new(0);

    let t_gen = std::time::Instant::now();
    let all_rows: Vec<(i64, i64, i16)> = (0u32..(1 << 25))
        .into_par_iter()
        .filter_map(|img_bits| {
            let analyzed_image = generator::analyze(img_bits);

            if analyzed_image.tags.is_empty() {
                None
            } else {
                let count = counter.fetch_add(1, Ordering::Relaxed);
                if count % 1_000_000 == 0 {
                    eprintln!("...analyzed {:>15} images", count.separate_with_commas());
                }

                Some((
                    img_bits as i64,
                    analyzed_image.tags.bits() as i64,
                    analyzed_image.black_cnt as i16,
                ))
            }
        })
        .collect();

    eprintln!("gen and analysis took {:?}", t_gen.elapsed());

    eprintln!("streaming {} rows to db...", all_rows.len());
    let t_stream = std::time::Instant::now();

    for (i, (img_bits, tag_bits, black_cnt)) in all_rows.iter().enumerate() {
        if i as u64 % 1_000_000 == 0 {
            eprintln!("...wrote {:>15} rows", i.separate_with_commas());
        }

        let row: [&(dyn ToSql + Sync); 3] = [img_bits, tag_bits, black_cnt];
        writer.write(&row)?;
    }

    let total: u64 = writer.finish()?;
    eprintln!(
        "done - {} rows copied to db in {:?}",
        total.separate_with_commas(),
        t_stream.elapsed()
    );

    client.batch_execute("ANALYZE bw25;")?;
    eprintln!("analyze complete");

    Ok(())
}

use std::{fs, path::Path};

fn main() {
    eprintln!("cargo:rerun-if-changed=tags.yaml");

    let yaml = fs::read_to_string("tags.yaml").expect("tags.yaml missing");

    let mut rust = String::from(
        "use bitflags::bitflags;\n\nbitflags! {\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\n    pub struct TagBits: u64 {\n",
    );

    let mut ts_bits = String::from("export const TagBits = {\n");
    let mut ts_labels = String::from("export const TagLabels = {\n");

    for line in yaml.lines() {
        if line.trim().is_empty() || line.starts_with('#') {
            continue;
        }

        let parts: Vec<_> = line.splitn(3, ';').map(|s| s.trim()).collect();
        let bit_match = parts[0].trim_start_matches("bit:").trim();
        println!("bit_match -> {bit_match}");

        let bit: u32 = parts[0]
            .trim_start_matches("- bit:")
            .trim()
            .parse()
            .unwrap();
        let name: &str = parts[1].trim_start_matches("name:").trim();
        let label: &str = parts[2].trim_start_matches("label:").trim();

        rust += &format!("        const {} = 1 << {};\n", name, bit);
        ts_bits += &format!("  {}: 1n << {}n,\n", name, bit);
        ts_labels += &format!("   {}: '{label}', \n", name);
    }

    rust += "    }\n}\n";
    ts_bits += "} as const;\n";
    ts_labels += "} satisfies Record<keyof typeof TagBits, string>;\n";

    let ts = ts_bits + "\n" + &ts_labels + "\nexport type TagMask = bigint;\n";

    fs::write(Path::new("src").join("tagbits.rs"), rust).unwrap();
    fs::write(Path::new("../api").join("tags.ts"), ts).unwrap();
}

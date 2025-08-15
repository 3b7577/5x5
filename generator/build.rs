use std::{fs, path::Path};

fn main() {
    println!("cargo:rerun-if-changed=tags.yaml");

    let yaml = fs::read_to_string("tags.yaml").expect("tags.yaml missing");

    let mut rust = String::from(
        "use bitflags::bitflags;\n\nbitflags! {\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\n    pub struct TagBits: u64 {\n",
    );

    let ts = String::from(
        "// auto-generated file - do not change manually. See generator/build.rs for details\n\n",
    );
    let mut ts_map = String::from("export const TAG = {\n");
    let mut ts_bits = String::from("export const BIT = {\n");

    let mut ts_types = String::from("");
    let ts_helpers =
        String::from("export const isTagKey = (k: string): k is TagKey => k in TAG;\n\n");

    for line in yaml.lines() {
        let t = line.trim();
        if t.is_empty() || t.starts_with('#') {
            continue;
        }

        let parts: Vec<_> = line.splitn(4, ';').map(|s| s.trim()).collect();
        let bit_match = parts[0].trim_start_matches("bit:").trim();
        println!("bit_match -> {bit_match}");

        let bit: u32 = parts[0]
            .trim_start_matches("- bit:")
            .trim()
            .parse()
            .unwrap();
        let name: &str = parts[1].trim_start_matches("name:").trim();
        let label: &str = parts[2].trim_start_matches("label:").trim();
        let category: &str = parts[3].trim_start_matches("category:").trim();

        rust += &format!("        const {} = 1 << {};\n", name, bit);

        ts_map += &format!(
            "  {name}: {{ key: '{name}', label: '{}', bit: 1n << {bit}n, category: '{}' }},\n",
            label, category
        );
        ts_bits += &format!("  {name}: 1n << {bit}n,\n");
    }

    rust += "    }\n}\n";

    ts_map += "} as const;\n\n";
    ts_types += "export type TagKey = keyof typeof TAG;\n\n";
    ts_types += "export type Tag = typeof TAG[TagKey];\n\n";
    ts_map += "export const TAGS = Object.values(TAG) as readonly Tag[];\n\n";

    ts_bits += "} as const;\n\n";

    fs::write(Path::new("src").join("tagbits.rs"), rust).unwrap();
    fs::write(
        Path::new("../shared").join("tags.ts"),
        ts + &ts_map + &ts_bits + &ts_types + &ts_helpers,
    )
    .unwrap();
}

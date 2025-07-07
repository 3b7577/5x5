pub mod tagbits;
pub use tagbits::TagBits;

pub mod analysis;
pub use analysis::*;

pub mod masks;
pub mod shape_defs;

pub mod structs;
pub use structs::*;

pub struct AnalyzedImage {
    pub black_cnt: u8,
    pub tags: TagBits,
}

pub fn analyze(bits: u32) -> AnalyzedImage {
    let img = ImageView::new(bits);
    let mut tags = TagBits::empty();

    tags |= analyze_borders(&img);
    tags |= analyze_center(&img);
    tags |= analyze_general(&img);
    tags |= analyze_shapes(&img);
    tags |= analyze_symmetry(&img);

    AnalyzedImage {
        black_cnt: img.black_cnt,
        tags,
    }
}

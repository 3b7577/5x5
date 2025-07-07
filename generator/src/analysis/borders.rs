use crate::masks::*;
use crate::ImageView;
use crate::TagBits;

pub fn analyze_borders(img: &ImageView) -> TagBits {
    let mut tags: TagBits = TagBits::empty();

    let mut flag_if_matches = |mask: u32, moderate: TagBits, strict: TagBits| {
        if img.bits & mask != 0 {
            tags |= moderate;
        }

        if img.bits & mask == mask {
            tags |= strict;
        }
    };

    flag_if_matches(
        TOP_MASK,
        TagBits::TOP_BORDER_MODERATE,
        TagBits::TOP_BORDER_STRICT,
    );

    flag_if_matches(
        BOTTOM_MASK,
        TagBits::BOTTOM_BORDER_MODERATE,
        TagBits::BOTTOM_BORDER_STRICT,
    );

    flag_if_matches(
        LEFT_MASK,
        TagBits::LEFT_BORDER_MODERATE,
        TagBits::LEFT_BORDER_STRICT,
    );

    flag_if_matches(
        RIGHT_MASK,
        TagBits::RIGHT_BORDER_MODERATE,
        TagBits::RIGHT_BORDER_STRICT,
    );

    flag_if_matches(
        FULL_BORDER_MASK,
        TagBits::FULL_BORDER_MODERATE,
        TagBits::FULL_BORDER_STRICT,
    );

    tags
}

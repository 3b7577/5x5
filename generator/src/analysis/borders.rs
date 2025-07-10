use crate::ImageView;
use crate::TagBits;
use crate::masks::*;

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
        TagBits::BORDERS_TOP_BORDER_MODERATE,
        TagBits::BORDERS_TOP_BORDER_STRICT,
    );

    flag_if_matches(
        BOTTOM_MASK,
        TagBits::BORDERS_BOTTOM_BORDER_MODERATE,
        TagBits::BORDERS_BOTTOM_BORDER_STRICT,
    );

    flag_if_matches(
        LEFT_MASK,
        TagBits::BORDERS_LEFT_BORDER_MODERATE,
        TagBits::BORDERS_LEFT_BORDER_STRICT,
    );

    flag_if_matches(
        RIGHT_MASK,
        TagBits::BORDERS_RIGHT_BORDER_MODERATE,
        TagBits::BORDERS_RIGHT_BORDER_STRICT,
    );

    flag_if_matches(
        FULL_BORDER_MASK,
        TagBits::BORDERS_FULL_BORDER_MODERATE,
        TagBits::BORDERS_FULL_BORDER_STRICT,
    );

    tags
}

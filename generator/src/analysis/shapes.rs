use crate::masks::ALL_CORNERS_MASK;
use crate::shape_defs::*;
use crate::TagBits;
use crate::{Bounds, ImageView};

fn has_cross_anywhere(img: &ImageView) -> bool {
    for r in 1..4 {
        for c in 1..4 {
            if img.get_bit(r, c) == 1
                && img.get_bit(r - 1, c) == 1
                && img.get_bit(r + 1, c) == 1
                && img.get_bit(r, c - 1) == 1
                && img.get_bit(r, c + 1) == 1
            {
                return true;
            }
        }
    }

    false
}

fn has_all_corners(img: &ImageView) -> bool {
    (img.bits & ALL_CORNERS_MASK) == ALL_CORNERS_MASK
}

fn has_shape(img: &ImageView, shapes_set: &[ShapePatternWindowed]) -> bool {
    for shape in shapes_set {
        for base_v_r in 0..=(5 - shape.height) {
            for base_v_c in 0..=(5 - shape.width) {
                let matches = shape
                    .points
                    .iter()
                    .all(|&(dr, dc)| img.get_bit(base_v_r + dr, base_v_c + dc) == 1);

                if matches
                    && img.is_isolated(Bounds {
                        top: base_v_r,
                        bottom: base_v_r + shape.height - 1,
                        left: base_v_c,
                        right: base_v_c + shape.width - 1,
                    })
                {
                    return true;
                }
            }
        }
    }

    false
}

pub fn analyze_shapes(img: &ImageView) -> TagBits {
    let mut tags: TagBits = TagBits::empty();

    if has_cross_anywhere(img) {
        tags |= TagBits::SHAPE_CROSS;
    }

    if has_all_corners(img) {
        tags |= TagBits::SHAPE_ALL_CORNERS;
    }

    if has_shape(img, L_SHAPES) {
        tags |= TagBits::SHAPE_L;
    }

    if has_shape(img, T_SHAPES) {
        tags |= TagBits::SHAPE_T;
    }

    if has_shape(img, RINGS) {
        tags |= TagBits::SHAPE_RING;
    }

    if has_shape(img, X_SHAPES) {
        tags |= TagBits::SHAPE_X;
    }

    if has_shape(img, ARROW_SHAPES) {
        tags |= TagBits::SHAPE_ARROW;
    }

    if has_shape(img, H_SHAPES) {
        tags |= TagBits::SHAPE_H;
    }

    tags
}

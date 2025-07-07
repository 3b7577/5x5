use crate::masks::*;
use crate::ImageView;
use crate::TagBits;

const CENTER_PX_COUNT: f32 = 9.0;
const EDGE_PX_COUNT: f32 = 16.0;
const CENTER_VS_EDGE_THRESHOLD: f32 = 0.25;
pub const HALF_VS_HALF_THRESHOLD: f32 = 0.2;
pub const CORNER_HEAVY_THRESHOLD: f32 = 0.3;

pub fn analyze_center(img: &ImageView) -> TagBits {
    let mut tags: TagBits = TagBits::empty();
    let total_px: f32 = img.black_cnt as f32;
    let center_black: u32 = (img.bits & CENTER_ZONE_MASK).count_ones();
    let edge_black: f32 = (img.bits & EDGE_MASK).count_ones() as f32;
    let top_half_black: f32 = (img.bits & TOP_HALF_MASK).count_ones() as f32;
    let bottom_half_black: f32 = (img.bits & BOTTOM_HALF_MASK).count_ones() as f32;
    let left_half_black: f32 = (img.bits & LEFT_HALF_MASK).count_ones() as f32;
    let right_half_black: f32 = (img.bits & RIGHT_HALF_MASK).count_ones() as f32;
    let top_left_black: f32 = (img.bits & TOP_LEFT_CORNER_MASK).count_ones() as f32;
    let top_right_black: f32 = (img.bits & TOP_RIGHT_CORNER_MASK).count_ones() as f32;
    let bottom_left_black: f32 = (img.bits & BOTTOM_LEFT_CORNER_MASK).count_ones() as f32;
    let bottom_right_black: f32 = (img.bits & BOTTOM_RIGHT_CORNER_MASK).count_ones() as f32;

    if center_black == 0 {
        tags |= TagBits::CENTER_EMPTY;
    }

    let center_density: f32 = center_black as f32 / CENTER_PX_COUNT;
    let edge_density: f32 = edge_black / EDGE_PX_COUNT;

    if center_density - edge_density >= CENTER_VS_EDGE_THRESHOLD {
        tags |= TagBits::CENTER_HEAVY;
    } else if edge_density - center_density >= CENTER_VS_EDGE_THRESHOLD {
        tags |= TagBits::EDGE_HEAVY;
    }

    let top_half_density: f32 = top_half_black / total_px;
    let bottom_half_density: f32 = bottom_half_black / total_px;
    let left_half_density: f32 = left_half_black / total_px;
    let right_half_density: f32 = right_half_black / total_px;

    if top_half_density - bottom_half_density >= HALF_VS_HALF_THRESHOLD {
        tags |= TagBits::TOP_HEAVY;
    } else if bottom_half_density - top_half_density >= HALF_VS_HALF_THRESHOLD {
        tags |= TagBits::BOTTOM_HEAVY;
    }

    if left_half_density - right_half_density >= HALF_VS_HALF_THRESHOLD {
        tags |= TagBits::LEFT_HEAVY;
    } else if right_half_density - left_half_density >= HALF_VS_HALF_THRESHOLD {
        tags |= TagBits::RIGHT_HEAVY;
    }

    let top_left_corner_density: f32 = top_left_black / total_px;
    let top_right_corner_density: f32 = top_right_black / total_px;
    let bottom_left_corner_density: f32 = bottom_left_black / total_px;
    let bottom_right_corner_density: f32 = bottom_right_black / total_px;

    let mut flag_if_matches_corner =
        |current_cnt: f32, current_density: f32, others: [f32; 3], tag: TagBits| {
            if current_cnt < 3.0 {
                return;
            }

            let avg: f32 = (others[0] + others[1] + others[2]) / 3.0;
            if current_density - avg >= CORNER_HEAVY_THRESHOLD {
                tags |= tag;
            }
        };

    flag_if_matches_corner(
        top_left_black,
        top_left_corner_density,
        [
            top_right_corner_density,
            bottom_left_corner_density,
            bottom_right_corner_density,
        ],
        TagBits::TOP_LEFT_HEAVY,
    );

    flag_if_matches_corner(
        top_right_black,
        top_right_corner_density,
        [
            top_left_corner_density,
            bottom_left_corner_density,
            bottom_right_corner_density,
        ],
        TagBits::TOP_RIGHT_HEAVY,
    );

    flag_if_matches_corner(
        bottom_left_black,
        bottom_left_corner_density,
        [
            top_left_corner_density,
            top_right_corner_density,
            bottom_right_corner_density,
        ],
        TagBits::BOTTOM_LEFT_HEAVY,
    );

    flag_if_matches_corner(
        bottom_right_black,
        bottom_right_corner_density,
        [
            top_left_corner_density,
            top_right_corner_density,
            bottom_left_corner_density,
        ],
        TagBits::BOTTOM_RIGHT_HEAVY,
    );

    tags
}

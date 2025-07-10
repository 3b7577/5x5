use crate::masks::LINE_MASKS;
use crate::{ImageView, TagBits};

fn has_isolated_pixel(img: &ImageView) -> bool {
    for r in 0..5 {
        for c in 0..5 {
            if img.get_bit(r, c) == 0 {
                continue;
            }

            let mut isolated: bool = true;

            for dr in -1..=1 {
                for dc in -1..=1 {
                    if dr == 0 && dc == 0 {
                        continue;
                    }

                    let nr = r as isize + dr;
                    let nc = c as isize + dc;

                    if nr >= 0 && nr < 5 && nc >= 0 && nc < 5 {
                        if img.get_bit(nr as usize, nc as usize) == 1 {
                            isolated = false;
                            break;
                        }
                    }
                }

                if !isolated {
                    break;
                }
            }

            if isolated {
                return true;
            }
        }
    }

    false
}

pub fn analyze_general(img: &ImageView) -> TagBits {
    let mut tags: TagBits = TagBits::empty();
    for row in 0..5 {
        let bits = img.row_bits[row];

        for &mask in LINE_MASKS.iter() {
            if bits & mask == mask {
                let above = if row > 0 {
                    img.row_bits[row - 1] & mask
                } else {
                    0
                };
                let below = if row < 4 {
                    img.row_bits[row + 1] & mask
                } else {
                    0
                };

                if (above & mask == 0) && (below & mask) == 0 {
                    tags |= TagBits::GENERAL_HORIZONTAL_LINE;
                }

                break;
            }
        }
    }

    for col in 0..5 {
        let bits = img.col_bits[col];

        for &mask in LINE_MASKS.iter() {
            if bits & mask == mask {
                let left = if col > 0 {
                    img.col_bits[col - 1] & mask
                } else {
                    0
                };
                let right = if col < 4 {
                    img.col_bits[col + 1] & mask
                } else {
                    0
                };

                if (left & mask == 0) && (right & mask == 0) {
                    tags |= TagBits::GENERAL_VERTICAL_LINE;
                }

                break;
            }
        }
    }

    if has_isolated_pixel(img) {
        tags |= TagBits::GENERAL_ISOLATED_PIXELS;
    }

    tags
}

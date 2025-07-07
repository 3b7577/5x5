use crate::{ImageView, TagBits};

fn check_sym_h(img: &ImageView) -> bool {
    for i in 0..2 {
        let top = img.row_bits[i];
        let bottom = img.row_bits[4 - i];

        if top != bottom {
            return false;
        }
    }

    true
}

fn check_sym_v(img: &ImageView) -> bool {
    for i in 0..2 {
        let left = img.col_bits[i];
        let right = img.col_bits[4 - i];

        if left != right {
            return false;
        }
    }

    true
}

fn check_sym_diag(img: &ImageView) -> bool {
    for r in 0..5 {
        for c in (r + 1)..5 {
            if img.get_bit(r, c) != img.get_bit(c, r) {
                return false;
            }
        }
    }

    true
}

fn check_sym_anti_diag(img: &ImageView) -> bool {
    for r in 0..5 {
        for c in 0..5 {
            if r + c >= 4 {
                continue;
            }

            if img.get_bit(r, c) != img.get_bit(4 - c, 4 - r) {
                return false;
            }
        }
    }

    true
}

fn check_four_fold_rotation(img: &ImageView) -> bool {
    let mut rotated = img.rotate_90();

    for _ in 0..3 {
        if rotated.bits != img.bits {
            return false;
        }

        rotated = rotated.rotate_90();
    }

    true
}

pub fn analyze_symmetry(img: &ImageView) -> TagBits {
    let mut tags: TagBits = TagBits::empty();

    if check_sym_h(img) {
        tags |= TagBits::SYM_H;
    }

    if check_sym_v(img) {
        tags |= TagBits::SYM_V;
    }

    if check_sym_diag(img) {
        tags |= TagBits::SYM_DIAG;
    }

    if check_sym_anti_diag(img) {
        tags |= TagBits::SYM_ANTI_DIAG;
    }

    if tags.bits().count_ones() == 4 {
        tags |= TagBits::SYM_ALL;
    }

    if !tags.is_empty() {
        tags |= TagBits::SYM;
    }

    if check_four_fold_rotation(img) {
        tags |= TagBits::FOUR_FOLD_ROTATION;
    }

    tags
}

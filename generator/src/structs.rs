use std::usize;

pub struct Bounds {
    pub top: usize,
    pub bottom: usize,
    pub left: usize,
    pub right: usize,
}

pub struct ImageView {
    pub bits: u32,
    pub black_cnt: u8,
    pub row_bits: [u8; 5],
    pub col_bits: [u8; 5],
}

impl ImageView {
    pub fn new(bits: u32) -> Self {
        let mut row_bits = [0u8; 5];
        let mut col_bits = [0u8; 5];

        for r in 0..5 {
            row_bits[r] = ((bits >> ((4 - r) * 5)) & 0b11111) as u8;
        }

        for c in 0..5 {
            col_bits[c] = (0..5).fold(0u8, |acc, r| {
                let bit = ((bits >> (24 - (r * 5 + c))) & 1) as u8;
                acc | (bit << (4 - r))
            });
        }

        Self {
            bits,
            black_cnt: bits.count_ones() as u8,
            row_bits,
            col_bits,
        }
    }

    #[inline(always)]
    pub fn get_idx(r: usize, c: usize) -> usize {
        24 - (r * 5 + c)
    }

    pub fn get_bit(&self, r: usize, c: usize) -> u32 {
        (self.bits >> (Self::get_idx(r, c))) & 1
    }

    pub fn rotate_90(&self) -> ImageView {
        let mut rotated = 0u32;
        // in rotated by 90deg img bit at (r,c) will be at (4-c, r) of original
        for r in 0..5 {
            for c in 0..5 {
                let src_bit = self.get_bit(4 - c, r);
                let dst_idx = Self::get_idx(r, c);

                rotated |= src_bit << dst_idx
            }
        }

        ImageView::new(rotated)
    }

    pub fn is_isolated(&self, b: Bounds) -> bool {
        let is_above_empty = b.top == 0 || self.row_bits[b.top - 1] == 0;
        let is_bottom_empty = b.bottom == 4 || self.row_bits[b.bottom + 1] == 0;
        let is_left_empty = b.left == 0 || self.col_bits[b.left - 1] == 0;
        let is_right_empty = b.right == 4 || self.col_bits[b.right + 1] == 0;

        is_above_empty && is_bottom_empty && is_left_empty && is_right_empty
    }
}

// Original:                u32 = 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
// 24 23 22 21 20   ← row 0
// 19 18 17 16 15   ← row 1
// 14 13 12 11 10   ← row 2
//  9  8  7  6  5   ← row 3
//  4  3  2  1  0   ← row 4

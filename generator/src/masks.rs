pub const TOP_MASK: u32 = 0b11111 << 20;
pub const BOTTOM_MASK: u32 = 0b11111;
pub const LEFT_MASK: u32 = (1 << 24) | (1 << 19) | (1 << 14) | (1 << 9) | (1 << 4);
pub const RIGHT_MASK: u32 = (1 << 20) | (1 << 15) | (1 << 10) | (1 << 5) | (1 << 0);
pub const FULL_BORDER_MASK: u32 = TOP_MASK | BOTTOM_MASK | LEFT_MASK | RIGHT_MASK;
pub const EDGE_MASK: u32 = FULL_BORDER_MASK;

pub const CENTER_ZONE_MASK: u32 = (1 << 18)
    | (1 << 17)
    | (1 << 16)
    | (1 << 13)
    | (1 << 12)
    | (1 << 11)
    | (1 << 8)
    | (1 << 7)
    | (1 << 6);

pub const TOP_HALF_MASK: u32 = TOP_MASK | 0b11111 << 15;

pub const BOTTOM_HALF_MASK: u32 = BOTTOM_MASK | 0b11111 << 5;

pub const LEFT_HALF_MASK: u32 = LEFT_MASK | (1 << 23) | (1 << 18) | (1 << 13) | (1 << 8) | (1 << 3);

pub const RIGHT_HALF_MASK: u32 =
    RIGHT_MASK | (1 << 21) | (1 << 16) | (1 << 11) | (1 << 6) | (1 << 1);

pub const TOP_LEFT_CORNER_MASK: u32 = (1 << 24) | (1 << 23) | (1 << 19) | (1 << 18);
pub const TOP_RIGHT_CORNER_MASK: u32 = (1 << 21) | (1 << 20) | (1 << 16) | (1 << 15);
pub const BOTTOM_LEFT_CORNER_MASK: u32 = (1 << 9) | (1 << 8) | (1 << 4) | (1 << 3);
pub const BOTTOM_RIGHT_CORNER_MASK: u32 = (1 << 6) | (1 << 5) | (1 << 1) | (1 << 0);

pub const LINE_MASKS: [u8; 6] = [0b11100, 0b01110, 0b00111, 0b11110, 0b01111, 0b11111];

pub const ALL_CORNERS_MASK: u32 = 1 << 24 | 1 << 20 | 1 << 4 | 1 << 0;

// Bits:     ↓ rows
// 24 23 22 21 20   ← row 0
// 19 18 17 16 15   ← row 1
// 14 13 12 11 10   ← row 2
//  9  8  7  6  5   ← row 3
//  4  3  2  1  0   ← row 4
//         -> cols

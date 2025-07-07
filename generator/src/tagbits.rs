use bitflags::bitflags;

bitflags! {
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
    pub struct TagBits: u64 {
        const SYM_H = 1 << 0;
        const SYM_V = 1 << 1;
        const SYM_DIAG = 1 << 2;
        const SYM_ANTI_DIAG = 1 << 3;
        const SYM = 1 << 4;
        const SYM_ALL = 1 << 5;
        const FOUR_FOLD_ROTATION = 1 << 6;
        const TOP_BORDER_STRICT = 1 << 7;
        const TOP_BORDER_MODERATE = 1 << 8;
        const BOTTOM_BORDER_STRICT = 1 << 9;
        const BOTTOM_BORDER_MODERATE = 1 << 10;
        const LEFT_BORDER_STRICT = 1 << 11;
        const LEFT_BORDER_MODERATE = 1 << 12;
        const RIGHT_BORDER_STRICT = 1 << 13;
        const RIGHT_BORDER_MODERATE = 1 << 14;
        const FULL_BORDER_MODERATE = 1 << 15;
        const FULL_BORDER_STRICT = 1 << 16;
        const CENTER_HEAVY = 1 << 17;
        const CENTER_EMPTY = 1 << 18;
        const EDGE_HEAVY = 1 << 19;
        const TOP_HEAVY = 1 << 20;
        const BOTTOM_HEAVY = 1 << 21;
        const LEFT_HEAVY = 1 << 22;
        const RIGHT_HEAVY = 1 << 23;
        const TOP_LEFT_HEAVY = 1 << 24;
        const TOP_RIGHT_HEAVY = 1 << 25;
        const BOTTOM_LEFT_HEAVY = 1 << 26;
        const BOTTOM_RIGHT_HEAVY = 1 << 27;
        const SHAPE_CROSS = 1 << 28;
        const SHAPE_ALL_CORNERS = 1 << 29;
        const SHAPE_L = 1 << 30;
        const SHAPE_T = 1 << 31;
        const SHAPE_RING = 1 << 32;
        const SHAPE_X = 1 << 33;
        const SHAPE_ARROW = 1 << 34;
        const SHAPE_H = 1 << 35;
        const HORIZONTAL_LINE = 1 << 36;
        const VERTICAL_LINE = 1 << 37;
        const ISOLATED_PIXELS = 1 << 38;
    }
}

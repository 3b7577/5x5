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
        const SYM_FOUR_FOLD_ROTATION = 1 << 6;
        const BORDERS_TOP_BORDER_STRICT = 1 << 7;
        const BORDERS_TOP_BORDER_MODERATE = 1 << 8;
        const BORDERS_BOTTOM_BORDER_STRICT = 1 << 9;
        const BORDERS_BOTTOM_BORDER_MODERATE = 1 << 10;
        const BORDERS_LEFT_BORDER_STRICT = 1 << 11;
        const BORDERS_LEFT_BORDER_MODERATE = 1 << 12;
        const BORDERS_RIGHT_BORDER_STRICT = 1 << 13;
        const BORDERS_RIGHT_BORDER_MODERATE = 1 << 14;
        const BORDERS_FULL_BORDER_MODERATE = 1 << 15;
        const BORDERS_FULL_BORDER_STRICT = 1 << 16;
        const WEIGHT_CENTER_HEAVY = 1 << 17;
        const WEIGHT_CENTER_EMPTY = 1 << 18;
        const WEIGHT_EDGE_HEAVY = 1 << 19;
        const WEIGHT_TOP_HEAVY = 1 << 20;
        const WEIGHT_BOTTOM_HEAVY = 1 << 21;
        const WEIGHT_LEFT_HEAVY = 1 << 22;
        const WEIGHT_RIGHT_HEAVY = 1 << 23;
        const WEIGHT_TOP_LEFT_HEAVY = 1 << 24;
        const WEIGHT_TOP_RIGHT_HEAVY = 1 << 25;
        const WEIGHT_BOTTOM_LEFT_HEAVY = 1 << 26;
        const WEIGHT_BOTTOM_RIGHT_HEAVY = 1 << 27;
        const SHAPE_CROSS = 1 << 28;
        const SHAPE_ALL_CORNERS = 1 << 29;
        const SHAPE_L = 1 << 30;
        const SHAPE_T = 1 << 31;
        const SHAPE_RING = 1 << 32;
        const SHAPE_X = 1 << 33;
        const SHAPE_ARROW = 1 << 34;
        const SHAPE_H = 1 << 35;
        const GENERAL_HORIZONTAL_LINE = 1 << 36;
        const GENERAL_VERTICAL_LINE = 1 << 37;
        const GENERAL_ISOLATED_PIXELS = 1 << 38;
    }
}

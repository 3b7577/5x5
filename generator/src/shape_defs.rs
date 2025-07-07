pub struct ShapePattern {
    pub points: &'static [(usize, usize)],
}

pub struct ShapePatternWindowed {
    pub points: &'static [(usize, usize)],
    pub height: usize,
    pub width: usize,
}

pub const L_SHAPES: &[ShapePatternWindowed] = &[
    // 1 0
    // 1 0
    // 1 1
    ShapePatternWindowed {
        points: &[(0, 0), (1, 0), (2, 0), (2, 1)],
        width: 2,
        height: 3,
    },
    // 0 1
    // 0 1
    // 1 1
    ShapePatternWindowed {
        points: &[(0, 1), (1, 1), (2, 1), (2, 0)],
        width: 2,
        height: 3,
    },
    // 1 1
    // 1 0
    // 1 0
    ShapePatternWindowed {
        points: &[(0, 0), (0, 1), (1, 0), (2, 0)],
        width: 2,
        height: 3,
    },
    // 1 1
    // 0 1
    // 0 1
    ShapePatternWindowed {
        points: &[(0, 0), (0, 1), (1, 1), (2, 1)],
        width: 2,
        height: 3,
    },
    // 1 1 1
    // 1 0 0
    ShapePatternWindowed {
        points: &[(0, 0), (0, 1), (0, 2), (1, 0)],
        width: 3,
        height: 2,
    },
    // 1 0 0
    // 1 1 1
    ShapePatternWindowed {
        points: &[(0, 0), (1, 0), (1, 1), (1, 2)],
        width: 3,
        height: 2,
    },
    // 0 0 1
    // 1 1 1
    ShapePatternWindowed {
        points: &[(0, 2), (1, 0), (1, 1), (1, 2)],
        width: 3,
        height: 2,
    },
    // 1 1 1
    // 0 0 1
    ShapePatternWindowed {
        points: &[(0, 0), (0, 1), (0, 2), (1, 2)],
        width: 3,
        height: 2,
    },
];

pub const T_SHAPES: &[ShapePatternWindowed] = &[
    // 1 1 1
    // 0 1 0
    // 0 1 0
    ShapePatternWindowed {
        points: &[(0, 0), (0, 1), (0, 2), (1, 1), (2, 1)],
        width: 3,
        height: 3,
    },
    // 1 1 1 1
    // 0 1 1 0
    // 0 1 1 0
    ShapePatternWindowed {
        points: &[
            (0, 0),
            (0, 1),
            (0, 2),
            (0, 3),
            (1, 1),
            (1, 2),
            (2, 1),
            (2, 2),
        ],
        width: 4,
        height: 3,
    },
    // 1 1 1 1
    // 1 1 1 1
    // 0 1 1 0
    // 0 1 1 0
    ShapePatternWindowed {
        points: &[
            (0, 0),
            (0, 1),
            (0, 2),
            (0, 3),
            (1, 0),
            (1, 1),
            (1, 2),
            (1, 3),
            (2, 1),
            (2, 2),
            (3, 1),
            (3, 2),
        ],
        width: 4,
        height: 4,
    },
    // 1 1 1 1 1
    // 0 0 1 0 0
    // 0 0 1 0 0
    // 0 0 1 0 0
    ShapePatternWindowed {
        points: &[
            (0, 0),
            (0, 1),
            (0, 2),
            (0, 3),
            (0, 4),
            (1, 2),
            (2, 2),
            (3, 2),
        ],
        width: 5,
        height: 4,
    },
    // 1 1 1 1 1
    // 0 0 1 0 0
    // 0 0 1 0 0
    // 0 0 1 0 0
    // 0 0 1 0 0
    ShapePatternWindowed {
        points: &[
            (0, 0),
            (0, 1),
            (0, 2),
            (0, 3),
            (0, 4),
            (1, 2),
            (2, 2),
            (3, 2),
            (4, 2),
        ],
        width: 5,
        height: 5,
    },
];

// 111
// 101
// 111
pub const RING_3X3_FULL: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 1),
        (0, 2),
        (1, 0),
        (1, 2),
        (2, 0),
        (2, 1),
        (2, 2),
    ],
    width: 3,
    height: 3,
};

//  010
//  101
//  010
pub const RING_3X3_THIN: ShapePatternWindowed = ShapePatternWindowed {
    points: &[(0, 1), (1, 0), (1, 2), (2, 1)],
    width: 3,
    height: 3,
};

// 1111
// 1001
// 1001
// 1111
pub const RING_4X4_FULL: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 1),
        (0, 2),
        (0, 3),
        (1, 0),
        (1, 3),
        (2, 0),
        (2, 3),
        (3, 0),
        (3, 1),
        (3, 2),
        (3, 3),
    ],
    width: 4,
    height: 4,
};

// 0110
// 1001
// 1001
// 0110
pub const RING_4X4_THIN: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 1),
        (0, 2),
        (1, 0),
        (1, 3),
        (2, 0),
        (2, 3),
        (3, 1),
        (3, 2),
    ],
    width: 4,
    height: 4,
};

// 11111
// 10001
// 10001
// 10001
// 11111

pub const RING_5X5_FULL: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 1),
        (0, 2),
        (0, 3),
        (0, 4),
        (1, 0),
        (1, 4),
        (2, 0),
        (2, 4),
        (3, 0),
        (3, 4),
        (4, 0),
        (4, 1),
        (4, 2),
        (4, 3),
        (4, 4),
    ],
    width: 5,
    height: 5,
};

// 01110
// 10001
// 10001
// 10001
// 01110

pub const RING_5X5_THIN: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 1),
        (0, 2),
        (0, 3),
        (1, 0),
        (1, 4),
        (2, 0),
        (2, 4),
        (3, 0),
        (3, 4),
        (4, 1),
        (4, 2),
        (4, 3),
    ],
    width: 5,
    height: 5,
};

pub const RINGS: &[ShapePatternWindowed] = &[
    RING_3X3_FULL,
    RING_3X3_THIN,
    RING_4X4_FULL,
    RING_4X4_THIN,
    RING_5X5_FULL,
    RING_5X5_THIN,
];

// 1 0 1
// 0 1 0
// 1 0 1
pub const X_SHAPE_3X3: ShapePatternWindowed = ShapePatternWindowed {
    points: &[(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)],
    width: 3,
    height: 3,
};

// 1 0 0 1
// 0 1 1 0
// 0 1 1 0
// 1 0 0 1
pub const X_SHAPE_4X4: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 3),
        (1, 1),
        (1, 2),
        (2, 1),
        (2, 2),
        (3, 0),
        (3, 3),
    ],
    width: 4,
    height: 4,
};

pub const X_SHAPES: &[ShapePatternWindowed] = &[X_SHAPE_3X3, X_SHAPE_4X4];

// 0 0 1 0
// 0 1 0 0
// 1 1 1 1
// 0 1 0 0
// 0 0 1 0
pub const ARROW_LEFT: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 2),
        (1, 1),
        (2, 0),
        (2, 1),
        (2, 2),
        (2, 3),
        (3, 1),
        (4, 2),
    ],
    width: 4,
    height: 5,
};

// 0 0 1 0 0
// 0 1 1 1 0
// 1 0 1 0 1
// 0 0 1 0 0
pub const ARROW_TOP: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 2),
        (1, 1),
        (1, 2),
        (1, 3),
        (2, 0),
        (2, 2),
        (2, 4),
        (3, 2),
    ],
    width: 5,
    height: 4,
};

// 0 1 0 0
// 0 0 1 0
// 1 1 1 1
// 0 0 1 0
// 0 1 0 0
pub const ARROW_RIGHT: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 1),
        (1, 2),
        (2, 0),
        (2, 1),
        (2, 2),
        (2, 3),
        (3, 2),
        (4, 1),
    ],
    width: 4,
    height: 5,
};

// 0 0 1 0 0
// 1 0 1 0 1
// 0 1 1 1 0
// 0 0 1 0 0
pub const ARROW_BOTTOM: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 2),
        (1, 0),
        (1, 2),
        (1, 4),
        (2, 1),
        (2, 2),
        (2, 3),
        (3, 2),
    ],
    width: 5,
    height: 4,
};

pub const ARROW_SHAPES: &[ShapePatternWindowed] =
    &[ARROW_LEFT, ARROW_TOP, ARROW_RIGHT, ARROW_BOTTOM];

// 1 0 1 0 0
// 1 1 1 0 0
// 1 0 1 0 0
// 0 0 0 0 0
// 0 0 0 0 0
pub const H_SHAPE_3X3: ShapePatternWindowed = ShapePatternWindowed {
    points: &[(0, 0), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 2)],
    height: 3,
    width: 3,
};

// 1 0 0 1 0
// 1 1 1 1 0
// 1 0 0 1 0
// 0 0 0 0 0
// 0 0 0 0 0
pub const H_SHAPE_4X3: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 3),
        (1, 0),
        (1, 1),
        (1, 2),
        (1, 3),
        (2, 0),
        (2, 3),
    ],
    height: 3,
    width: 4,
};

// 1 0 0 1 0
// 1 1 1 1 0
// 1 1 1 1 0
// 1 0 0 1 0
// 0 0 0 0 0
pub const H_SHAPE_4X4: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 3),
        (1, 0),
        (1, 1),
        (1, 2),
        (1, 3),
        (2, 0),
        (2, 1),
        (2, 2),
        (2, 3),
        (3, 0),
        (3, 3),
    ],
    height: 4,
    width: 4,
};

// 1 0 0 0 1
// 1 1 1 1 1
// 1 1 1 1 1
// 1 0 0 0 1
// 0 0 0 0 0
pub const H_SHAPE_5X4: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 4),
        (1, 0),
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4),
        (2, 0),
        (2, 1),
        (2, 2),
        (2, 3),
        (2, 4),
        (3, 0),
        (3, 4),
    ],
    height: 4,
    width: 5,
};

// 1 0 0 0 1
// 1 0 0 0 1
// 1 1 1 1 1
// 1 0 0 0 1
// 1 0 0 0 1
pub const H_SHAPE_5X5: ShapePatternWindowed = ShapePatternWindowed {
    points: &[
        (0, 0),
        (0, 4),
        (1, 0),
        (1, 4),
        (2, 0),
        (2, 1),
        (2, 2),
        (2, 3),
        (2, 4),
        (3, 0),
        (3, 4),
        (4, 0),
        (4, 4),
    ],
    height: 5,
    width: 5,
};

pub const H_SHAPES: &[ShapePatternWindowed] = &[
    H_SHAPE_3X3,
    H_SHAPE_4X3,
    H_SHAPE_4X4,
    H_SHAPE_5X4,
    H_SHAPE_5X5,
];

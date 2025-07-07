use generator::shape_defs::{
    ARROW_SHAPES, H_SHAPES, L_SHAPES, RINGS, ShapePatternWindowed, T_SHAPES, X_SHAPES,
};

fn assert_shape_within_bounds(shape: &ShapePatternWindowed) {
    for &(r, c) in shape.points {
        assert!(
            r < shape.height && c < shape.width,
            "Point ({}, {}) is out of bounds for 5x5 grid",
            r,
            c
        );
    }
}

#[test]
fn l_shapes_within_bounds() {
    for shape in L_SHAPES {
        assert_shape_within_bounds(shape);
    }
}

#[test]
fn t_shapes_within_bounds() {
    for shape in T_SHAPES {
        assert_shape_within_bounds(shape);
    }
}

#[test]
fn rings_within_bounds() {
    for shape in RINGS {
        assert_shape_within_bounds(shape);
    }
}

#[test]
fn x_shapes_within_bounds() {
    for shape in X_SHAPES {
        assert_shape_within_bounds(shape);
    }
}

#[test]
fn arrow_shapes_within_bounds() {
    for shape in ARROW_SHAPES {
        assert_shape_within_bounds(shape);
    }
}

#[test]
fn h_shapes_within_bounds() {
    for shape in H_SHAPES {
        assert_shape_within_bounds(shape);
    }
}

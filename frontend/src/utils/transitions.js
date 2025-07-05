export const FadeUp = (delay) => {
    return {
        initial: {
            opacity: 0,
            y: 50.
        },
        animate: {
            opacity: 1,
            y: 0, 
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.5,
                delay: delay,
                ease: "easeInOut",
            },
        },
    }
}

export const SlideLeft = (delay) => {
    return {
        initial: {
            opacity: 0,
            x: 50,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
            duration: 0.3,
            delay: delay,
            ease: "easeInOut",
            },
        },
    }
}
class Delay {
    public static run(func: any, time) {
        return setTimeout(func, time);
    }
    public static clear(time) {
        clearTimeout(time);
    }
}
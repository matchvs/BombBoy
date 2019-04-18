public interface MovePathLimit {
    /**
     * 在X轴上前方是否有限制
     * @param xInMap
     * @param yInMap
     * @param xArrow
     * @return
     */
    public boolean hasLimitX(int xInMap,int yInMap, int xArrow);

    /**
     * 在Y轴上前方是否有限制
     * @param xInMap
     * @param yInMap
     * @param yArrow
     * @return
     */
    public boolean hasLimitY(int xInMap,int yInMap, int yArrow);

}

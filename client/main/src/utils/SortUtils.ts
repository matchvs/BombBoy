class SortUtils {
	private constructor() {
	}

	/**
	 * 根据ID排序
	 * @param obj1
	 * @param obj2
	 * @returns {number}
	 */
	public static sortNumber(obj1, obj2) {
		var userID1 = obj1.userID;
		var userID2 = obj2.userID;
		if (userID1 < userID2) {
			return -1;
		} else if (userID1 > userID2) {
			return 1;
		} else {
			return 0;
		}


	}

	/**
	 * 交换位置，把房主放到第一位
	 * @param arr
	 * @param index1
	 * @param index2
	 * @returns {*}
	 */
	public static swapArray(arr, index1, index2) {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		return arr;
	}


	public static mask() {
		var shp: egret.Shape = new egret.Shape();
		shp.graphics.beginFill(0xff0000);
		shp.graphics.drawRect(0, 0, 100, 100);
		shp.graphics.endFill();
	}



}
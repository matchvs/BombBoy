class RoomUserList extends ListViewItemBase {

	public constructor(){
        super();
    }
	protected onItemClick(viewName: string, view: any): void {
		super.onItemClick(viewName,view);
		console.log('[List OnItemClick] :' + viewName);
	}
	protected dataChanged(): void {
		this.labelDisplay.text = this.data;
		console.log('[List DataChanged] : ' + JSON.stringify(this.data));
	}
}
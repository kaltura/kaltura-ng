export class PopupWidgetLayout {

  constructor() {}

  private static popupWidgetInitialZindex = 200;

  static getPopupZindex(){
      PopupWidgetLayout.popupWidgetInitialZindex += 2;
      return PopupWidgetLayout.popupWidgetInitialZindex;
  }
}

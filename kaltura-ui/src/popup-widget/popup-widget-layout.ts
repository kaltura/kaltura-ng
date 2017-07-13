export class PopupWidgetLayout {

  constructor() {}

  private static popupWidgetInitialZindex = 130000;

  static getPopupZindex(){
      PopupWidgetLayout.popupWidgetInitialZindex += 2;
      return PopupWidgetLayout.popupWidgetInitialZindex;
  }
}

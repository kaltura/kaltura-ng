import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { action } from '@storybook/addon-actions';

const columns = [
  { field: 'vin', header: 'Vin' },
  { field: 'year', header: 'Year' },
  { field: 'brand', header: 'Brand' },
  { field: 'color', header: 'Color' },
];

const data = [
  {
    'brand': 'VW',
    'year': 2012,
    'color': 'Orange',
    'vin': 'dsad231ff'
  },
  {
    'brand': 'Audi',
    'year': 2011,
    'color': 'Black',
    'vin': 'gwregre345'
  },
  {
    'brand': 'Renault',
    'year': 2005,
    'color': 'Gray',
    'vin': 'h354htr'
  },
  {
    'brand': 'BMW',
    'year': 2003,
    'color': 'Blue',
    'vin': 'j6w54qgh'
  },
  {
    'brand': 'Mercedes',
    'year': 1995,
    'color': 'Orange',
    'vin': 'hrtwy34'
  },
  {
    'brand': 'Volvo',
    'year': 2005,
    'color': 'Black',
    'vin': 'jejtyj'
  },
  {
    'brand': 'Honda',
    'year': 2012,
    'color': 'Yellow',
    'vin': 'g43gr'
  },
  {
    'brand': 'Jaguar',
    'year': 2013,
    'color': 'Orange',
    'vin': 'greg34'
  },
  {
    'brand': 'Ford',
    'year': 2000,
    'color': 'Black',
    'vin': 'h54hw5'
  },
  {
    'brand': 'Fiat',
    'year': 2013,
    'color': 'Red',
    'vin': '245t2s'
  }
];

const menuItems = [];

storiesOf('Table', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        TableModule,
        ButtonModule,
        MenuModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
              <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
              <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
      props: {
        data,
        cols: columns,
      }
    }),
    {
      notes: {
        markdown: `
        The documentation for a primeng table component can be found
        <a href="https://www.primefaces.org/primeng/#/table" target="_blank">here</a>
        `,
      }
    }
  )
  .add('Empty data', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
              <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
              <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <div class="emptymessage">No data message content</div>
        </ng-template>
      </p-table>
    `,
    props: {
      data: [],
      cols: columns,
    }
  }))
  .add('Pagination', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [paginator]="true" [rows]="5" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
            <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
      cols: columns,
    }
  }))
  .add('Sorting', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" sortField="year" defaultSortOrder="-1" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns" [pSortableColumn]="col.field">
              {{col.header}}
              <p-sortIcon [field]="col.field"></p-sortIcon>
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
            <td *ngFor="let col of columns">
              {{rowData[col.field]}}
            </td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
      cols: columns,
    }
  }))
  .add('Selection', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [scrollable]="true" scrollHeight="100%" (selectionChange)="selectionChange($event)">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
            <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr [pSelectableRow]="rowData">
            <td><p-tableCheckbox [value]="rowData"></p-tableCheckbox></td>
            <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
      cols: columns,
      selectionChange: action('selectionChange'),
    }
  }))
  .add('Row action', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
            <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
            <td>
              <button type="button" pButton icon="kIconmore" (click)="openMenu($event, menu, rowData)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
      <p-menu #menu [popup]="true" [model]="menuItems" [appendTo]="'body'"></p-menu>
    `,
    props: {
      data,
      cols: columns,
      menuItems,
      openMenu: (event, menu, item) => {
        menuItems.pop();
        menuItems.push({ label: 'Remove row', command: () => data.splice(data.indexOf(item), 1) });
        menu.toggle(event);
      }
    }
  }))
  .add('Expandable', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th></th>
            <th *ngFor="let col of columns">{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns" let-expanded="expanded">
          <tr>
            <td>
              <a [pRowToggler]="rowData">
                  <i [ngClass]="expanded ? 'pi pi-fw pi-chevron-circle-down' : 'pi pi-pw pi-chevron-circle-right'"></i>
              </a>
            </td>
            <td *ngFor="let col of columns">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
        <ng-template let-rowData let-columns="columns" pTemplate="rowexpansion">
          <tr>
            <td [attr.colspan]="columns.length + 1">Row expansion content for row: {{rowData.vin}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
      cols: columns,
    }
  }))
  .add('Resize columns', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" [resizableColumns]="true" [scrollable]="true" scrollHeight="100%">
        <ng-template pTemplate="colgroup" let-columns>
          <colgroup>
            <col *ngFor="let col of columns" >
          </colgroup>
        </ng-template>
        <ng-template pTemplate="header" let-columns>
          <tr>
              <th *ngFor="let col of columns" pResizableColumn>{{col.header}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
              <td *ngFor="let col of columns" class="ui-resizable-column">{{rowData[col.field]}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
      cols: columns,
    }
  }));

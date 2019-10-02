import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableModule } from 'primeng/table';

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
      ],
    })
  )
  .add('Default', () => ({
    template: `
      <p-table dataKey="vin" [value]="data">
        <ng-template pTemplate="header">
          <tr>
              <th>Vin</th>
              <th>Year</th>
              <th>Brand</th>
              <th>Color</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-car>
          <tr>
              <td>{{car.vin}}</td>
              <td>{{car.year}}</td>
              <td>{{car.brand}}</td>
              <td>{{car.color}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
    }
  }))
  .add('Pagination', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [paginator]="true" [rows]="5">
        <ng-template pTemplate="header">
          <tr>
              <th>Vin</th>
              <th>Year</th>
              <th>Brand</th>
              <th>Color</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-car>
          <tr>
              <td>{{car.vin}}</td>
              <td>{{car.year}}</td>
              <td>{{car.brand}}</td>
              <td>{{car.color}}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
    props: {
      data,
    }
  }))
  .add('Sorting', () => ({
    template: `
      <p-table dataKey="vin" [value]="data" [columns]="cols" sortField="year" defaultSortOrder="-1">
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
  }));

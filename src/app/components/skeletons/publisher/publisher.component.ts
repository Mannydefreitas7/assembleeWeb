import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'publisher-skeleton',
  template: `
    <div class="d-flex justify-content-start align-items-center">
    <ngx-skeleton-loader count="1" appearance="circle" class="me-2"></ngx-skeleton-loader>
      <div class="d-inline-flex align-items-center flex-wrap mt-2">
          <ngx-skeleton-loader count="1" class="border-2 w-100"></ngx-skeleton-loader>
          <ngx-skeleton-loader count="1" class="border-3 me-2" style="width:100px;"></ngx-skeleton-loader>
          <ngx-skeleton-loader count="1" class="border-3" style="width:60px;"></ngx-skeleton-loader>
        </div>
  </div>
  `,
})
export class PublisherComponent {

}

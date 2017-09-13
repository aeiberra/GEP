import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverArticlePage } from './popover-article';

@NgModule({
  declarations: [
    PopoverArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverArticlePage),
  ],
  exports: [
    PopoverArticlePage
  ]
})
export class PopoverArticlePageModule {}

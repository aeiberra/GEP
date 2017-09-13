import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageArticlePage } from './popover-image-article';

@NgModule({
  declarations: [
    PopoverImageArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageArticlePage),
  ],
  exports: [
    PopoverImageArticlePage
  ]
})
export class PopoverImageArticlePageModule {}

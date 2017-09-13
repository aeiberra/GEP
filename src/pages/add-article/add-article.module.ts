import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddArticlePage } from './add-article';

@NgModule({
  declarations: [
    AddArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(AddArticlePage),
  ],
  exports: [
    AddArticlePage
  ]
})
export class AddArticlePageModule {}

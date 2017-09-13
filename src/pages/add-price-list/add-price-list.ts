import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {LoadingProvider} from "../../providers/loading/loading";
import {PopoverArticlePage} from "../popover-article/popover-article";
import {AddArticlePage} from "../add-article/add-article";
import {PopoverImagePriceListPage} from "../popover-image-price-list/popover-image-price-list";

import jQuery from 'jquery'


@IonicPage()
@Component({
  selector: 'page-add-price-list',
  templateUrl: 'add-price-list.html',
})
export class AddPriceListPage {
  @Input() folder: string;

  title:any;

  priceLists:FirebaseListObservable<any[]>;
  taxesLists:FirebaseListObservable<any[]>;

  keyPriceList:any;
  codePriceList:any;
  namePriceList:any;
  photoPriceList:any = '../../assets/icon/priceList.png';
  descriptionPriceList:any;
  articlesPriceList:any;

  title_alert:any;
  subTitle_alert:any;

  searchQuery: string = '';
  articles:FirebaseListObservable<any[]>;
  public articlesList:Array<any>;
  public loadedArticlesList:Array<any>;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;
  editor:any;

  f:any;
  public Mathjs = require('mathjs');
  mathjsSuccess:boolean = true;
  taxes:any;
  taxesArray:any;
  equation:any;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  commands:any = [{
    "cmd": "insertHTML",
    "name": "0",
    "val": "<span>0</span>",
    "desc": "Insertar el numero 0 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "1",
    "val": "1",
    "desc": "Insertar el numero 1 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "2",
    "val": "2",
    "desc": "Insertar el numero 2 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "3",
    "val": "3",
    "desc": "Insertar el numero 3 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "4",
    "val": "4",
    "desc": "Insertar el numero 4 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "5",
    "val": "5",
    "desc": "Insertar el numero 5 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "6",
    "val": "6",
    "desc": "Insertar el numero 6 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "7",
    "val": "7",
    "desc": "Insertar el numero 7 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "8",
    "val": "8",
    "desc": "Insertar el numero 8 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "9",
    "val": "9",
    "desc": "Insertar el numero 9 (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "(",
    "val": "(",
    "desc": "Insertar ( (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": ")",
    "val": ")",
    "desc": "Insertar ) (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "+",
    "val": "+",
    "desc": "Insertar + (Borra la seleccion)."
  }, {
    "cmd": "insertText",
    "name": "-",
    "val": "-",
    "desc": "Insertar + (Borra la seleccion)."
  }, {
    "cmd": "delete",
    "name": "Borrar",
    "desc": "Borrar la seleccion actual."
  }, {
    "cmd": "undo",
    "name": "Atras",
    "desc": "Deshace el último comando ejecutado."
  }, {
    "cmd": "redo",
    "name": "Adelante",
    "desc": "Vuelve a hacer el comando de deshacer anterior."
  }, {
    "cmd": "selectAll",
    "name": "Seleccionar",
    "desc": "Selecciona todo el contenido de la región editable."
  }, {
    "cmd": "insertHTML",
    "name": "NETO",
    "val": "&ensp;<span contenteditable=\"false\" draggable=\"true\" class=\"draggable\" name=\"NETO\">NETO</span>&ensp;",
    "desc": "Costo Neto."
  }, {
    "cmd": "insertHTML",
    "name": "RENT",
    "val": "&ensp;<span contenteditable=\"false\" draggable=\"true\" class=\"draggable color10\" name=\"RENT\">RENT</span>&ensp;",
    "desc": "Rentabilidad."
  }
  ];

  commandRelation:any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController,
              public loadingProvider: LoadingProvider, public viewCtrl: ViewController) {
    if(navParams.data.priceListSelected){
      this.title = Translator.transform2('titleEdit_add_priceList');

      let priceList = navParams.data.priceListSelected;

      if(priceList.key)         this.keyPriceList = priceList.key;
      if(priceList.code)        this.codePriceList = priceList.code;
      if(priceList.name)        this.namePriceList = priceList.name;
      if(priceList.image)       this.photoPriceList = priceList.image.path;
      if(priceList.description) this.descriptionPriceList = priceList.description;
      if(priceList.articles)    this.articlesPriceList = priceList.articles;



    } else this.title = Translator.transform2('titleAdd_add_priceList');

    this.title_alert = Translator.transform2('title_saveAlert');
    this.subTitle_alert = Translator.transform2('subTitle_saveAlert');

    this.name = 'Angular2';
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 300;
    this.cropperSettings1.height = 300;
    this.cropperSettings1.croppedWidth = 300;
    this.cropperSettings1.croppedHeight = 300;
    this.cropperSettings1.canvasWidth = 300;
    this.cropperSettings1.canvasHeight = 300;
    this.cropperSettings1.minWidth = 75;
    this.cropperSettings1.minHeight = 75;
    this.cropperSettings1.rounded = true;
    this.cropperSettings1.keepAspect = true;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(222,222,222,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};

  }

  bindDraggables() {
    jQuery('.draggable').attr("contenteditable", false);
    jQuery('.draggable').off('dragstart').on('dragstart', e => {
      if (!e.target.id)
        e.target.id = (new Date()).getTime();
      e.originalEvent.dataTransfer.setData('text/html', e.target.outerHTML);
      jQuery(e.target).addClass('dragged');
    }).on('click', function() {
    });
  }

  upload(key) {
    if(this.data1 && this.data1.image){
      // Create a root reference
      let storageRef = this.firebaseApp.storage().ref();
      // Make local copies of services because "this" will be clobbered
      let af = this.db;
      let folder = this.folder;
      let path = `/${this.folder}/${key}`;
      let iRef = storageRef.child(path);
      iRef.putString(this.data1.image.split(',')[1], 'base64').then((snapshot) => {
        iRef.getDownloadURL().then(url => {
          af.list(`/${folder}`).update('/image/',{ path: url, filename: key })
        });
      });
    }
  }

  ngOnInit() {
    this.priceLists = this.db.list('GEP/price-lists');

    // Load Articles
    this.loadingProvider.loadingPresent();
    this.articles = this.db.list('GEP/products', {
      query: {
        orderByChild: 'code'
      }
    });
    this.articles.subscribe(itemList=>{
      let articles = [];

      itemList.forEach( item => {
        if(this.articlesPriceList){
          for(let i in this.articlesPriceList){
            if(item.key == this.articlesPriceList[i].key){
              item.cant = this.articlesPriceList[i].cant;
              item.checked = this.articlesPriceList[i].checked;
            }
          }
        }
        if(!item.cant){
          item.cant = item.netCost;
        }
        if(!item.checked){
          item.checked = false;
        }
        articles.push(item);
        return false;
      });
      this.articlesList = articles;
      this.loadedArticlesList = articles;
      this.loadingProvider.loadingDismiss();
    });

    this.taxesLists = this.db.list('GEP/taxs');
    this.taxesLists.subscribe(itemList=> {
      let i = 0;
      itemList.forEach( item => {
        if(item.type=='percentage') item.type = '%'; else item.type = '$';
        let value = "&ensp;<span contenteditable=\"false\" draggable=\"true\" class=\"draggable color"+i+"\" name=\""+ item.name +"\">" + item.type + item.value + "</span>&ensp;";
        this.commands.push({
          "cmd": "insertHTML",
          "name": item.name,
          "val": value,
          "value": item.value,
          "desc": item.description,
          "key": item.key,
          "type": item.type
        });
        if(i <= 8)i++;else i = 0;
      })
    });

  }

  ionViewWillLeave(){
    this.viewCtrl.dismiss().catch(() => {});
  }

  ionViewDidLoad() {
    jQuery('#editor').on('dragover', e => {
      e.preventDefault();
      return false;
    });

    jQuery('#editor').on('drop', e => {
      e.preventDefault();
      let i = e.originalEvent;
      let content = i.dataTransfer.getData('text/html');
      let range = null;
      if (document.caretRangeFromPoint) { // Chrome
        range = document.caretRangeFromPoint(i.clientX, i.clientY);
      }
      else if (i.rangeParent) { // Firefox
        range = document.createRange();
        range.setStart(i.rangeParent, i.rangeOffset);
      }
      let sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);

      jQuery('#editor').get(0).focus(); // essential
      document.execCommand('insertHTML',false, content);
      //$('#editor').append(content);
      sel.removeAllRanges();
      this.bindDraggables();
      jQuery('.dragged').remove();
    });
    this.bindDraggables();

    // jQuery( document ).ready(function() {
    //   jQuery('body').on('paste input', '[contenteditable]', function(data) {
    //     let text = jQuery('#editor').html();
    //
    //     if(text.match(/#/g) && text.match(/#/g).length > 0) {
    //       let newText = text.replace('#', '');
    //       jQuery('#editor').html(newText);
    //     }
    //   });
    // });
    let priceList = this.navParams.data.priceListSelected;
    if(priceList.editor)      jQuery('#editor').html(priceList.editor);
  }

  getItems(searchBar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    let q = searchBar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.articlesList = this.articlesList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.barCode && v.barCode.toString().toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.description && v.description.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.netCost && v.netCost.toString().toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.articlesList = this.loadedArticlesList;
  }

  viewArticle(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverArticlePage,x, {cssClass: 'article-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editArticle(popoverData);
    })
  }

  editArticle(x){
    this.navCtrl.push(AddArticlePage,{
      articleSelected: x
    });
  }

  onSubmit(f: NgForm) {
    let articlePriceList:any = [];
    if(this.articlesList){
      for(let i in this.articlesList){
        if(this.articlesList[i].cant > 0 && this.articlesList[i].checked){
          articlePriceList.push({
            key: this.articlesList[i].key,
            cant: this.articlesList[i].cant,
            checked: true,
          })
        }
      }
    }



    if(f.valid && !this.navParams.data.priceListSelected){
      let c = f.value;
      let key = this.priceLists.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        articles: articlePriceList || null,
        editor: jQuery('#editor').html().toString() || null,
        taxes: this.taxesArray || null,
        equation: this.equation || null
      }).key;
      this.folder = '/GEP/price-lists/'+key;
      this.upload(key);
      this.priceLists.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.priceListSelected){
      let c = f.value;
      this.db.object('GEP/price-lists/' + this.keyPriceList).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        articles: articlePriceList || null,
        editor: jQuery('#editor').html().toString() || null,
        taxes: this.taxesArray || null,
        equation: this.equation || null
      });
      this.folder = '/GEP/price-lists/'+this.keyPriceList;
      this.upload(this.keyPriceList);
      this.navCtrl.pop();
    } else if(f.invalid) {
      let alert = this.alertCtrl.create({
        title: this.title_alert,
        subTitle: this.subTitle_alert,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  openImage(){
    let photo = this.photoPriceList;
    let popover = this.popoverCtrl.create(PopoverImagePriceListPage, [{photo:photo}], {cssClass: 'priceList-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoPriceList = popoverData.image;
      }
    })
  }


  supported(cmd) {
    let css = !!document.queryCommandSupported(cmd.cmd) ? "btn-succes" : "btn-error";
    return css
  };

  doCommand(cmdKey) {
    if (this.supported(cmdKey) === "btn-error") {
      alert("execCommand(“" + cmdKey.cmd + "”)\nis not supported in your browser");
      return;
    }
    document.execCommand(cmdKey.cmd, false, (cmdKey.val || ""));
  }

  formula(){
    let editor = jQuery('#editor').html();
    let text = jQuery('#editor').find("span");
    this.equation = jQuery('#editor').html();

    this.taxes = [];
    this.taxesArray = {};
    for(let i = 0; i < text.length ; i++){
      editor = editor.replace(text[i].outerHTML.toString(),text[i].textContent);
      if(text[i].attributes['name']) this.equation = this.equation.replace(text[i].outerHTML.toString(), text[i].attributes['name'].value);

      for(let j in this.commands){
        let cmd = '';
        let cmd1 = "&ensp;"+text[i].outerHTML.toString()+"&ensp;";
        if(this.commands[j].val) cmd = this.commands[j].val.toString();

        if(cmd == cmd1){
          this.taxesArray[this.commands[j].name] = {
            value: this.commands[j].value || 'null',
            type: this.commands[j].type || 'null'
          };
        }
      }
    }
    console.log(this.equation);

    let cal = editor.replace(/\s/g,'').replace(/\+%/g,'*1.').replace(/\-%/g,'*1-').replace(/\%/g,'1.').replace(/NETO/g, 'µ').replace(/RENT/g, 'æ').replace(/[^0-9%^*µæ\/()\-+.]/g, '');
    console.log('cal', cal);

    this.mathjsSuccess = false;

    try{
      let cal1 = cal.replace(/µ/g, '100').replace(/\æ/g, '100');
      console.log(this.Mathjs.eval(cal1));
      this.mathjsSuccess = true;
      for(let i in this.articlesList){
        let neto = null;
        if(this.articlesList[i].type == 'quantity') neto = cal.replace(/æ/g, this.articlesList[i].value).replace(/undefined/g, '');
        else neto = cal.replace(/æ/g, '%'+this.articlesList[i].value).replace(/\+%/g,'*1.').replace(/\-%/g,'*1-').replace(/\%/g,'1.').replace(/\*1.undefined/g, '');
        neto = neto.replace(/µ/g, this.articlesList[i].netCost);
        this.articlesList[i].cant = parseFloat(this.Mathjs.eval(neto)).toFixed(2);
      }
    }
    catch (err){
      console.log(err);
      this.mathjsSuccess = false;
    }
  }

}

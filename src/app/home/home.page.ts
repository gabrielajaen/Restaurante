import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  images =[

    'https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg',
    'https://www.arrozsos.es/wp-content/uploads/2023/12/rice-with-grilled-vegetables-2023-11-27-04-51-37-utc-1080x675.jpg',
    'https://www.cardamomo.news/img/2022/03/08/comida_sana_y_barata.png?__scale=w:480,h:270,t:2',
 
  ]
  ngOnInit() {
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    });
  
  }

  swiperReady(){
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  swiperSlideChanged(e: any){
console.log('changed: ', e)
  }


}

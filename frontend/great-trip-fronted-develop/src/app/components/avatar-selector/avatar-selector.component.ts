import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {

  @Output() avatarSel = new EventEmitter<string>();
  @Input() currentAvatar: string = "av-1.png"

  avatars = [
    {
      img: 'av-1.png',
      selected: true
    },
    {
      img: 'av-2.png',
      selected: false
    },
    {
      img: 'av-3.png',
      selected: false
    },
    {
      img: 'av-4.png',
      selected: false
    },
    {
      img: 'av-5.png',
      selected: false
    },
    {
      img: 'av-6.png',
      selected: false
    },
    {
      img: 'av-7.png',
      selected: false
    },
    {
      img: 'av-8.png',
      selected: false
    },
];

  avatarSlide = {
    slidesPerView: 3.5
  };

  constructor() { }

  ngOnInit() {
    this.avatars.forEach( avatar => {
      avatar.selected = false
    })

    for (const avatar of this.avatars) {
      if(avatar.img == this.currentAvatar){
        avatar.selected = true; 
        break;
      }
    }
  }

  avatarSelected(avatar){
    this.avatars.forEach(av => av.selected = false);
    avatar.selected =  true;
    console.log(avatar.img);
    this.avatarSel.emit(avatar.img);
  }

}

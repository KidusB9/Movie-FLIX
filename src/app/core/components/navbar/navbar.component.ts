import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {themeColors} from '../../constants/theme-colors';
import {Color} from '../../enums/colors.enum';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  OnInit, OnDestroy} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { VoiceCommandComponent } from '../../../features/voice-command/voice-command.component';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    RouterLinkActive,
    NgOptimizedImage,
    RouterLink,
    MatIconModule,
    NgForOf,
    VoiceCommandComponent
  ],
  standalone: true
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isLoggedIn = false;
  private authSubscription!: Subscription;




  @Output() changeColorTheme: EventEmitter<string> = new EventEmitter();

  themeColorList = themeColors;
  themeColorInit: string = Color.RED;

  isScrolled = false;


  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (status) => {
        console.log("Auth status changed:", status);
        this.isLoggedIn = status;
        this.cdRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll')
  scrollEvent() {
    this.isScrolled = window.scrollY >= 30;
  }

  signOut(): void {
    this.authService.logout();
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }

  setColorTheme(color: string) {
    this.themeColorInit = color;
    this.changeColorTheme.emit(color);
  }
}

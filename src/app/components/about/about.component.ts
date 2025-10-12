import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;

  teamMembers = [
    {
      name: 'Omar Neili',
      age: 21,
      role: 'Développeur Full-Stack',
      email: 'omarneili308@gmail.com',
      education: 'Étudiant à l\'ISET de Rades Spécialité developpement systemes d information',
      image: 'assets/images/omar.jpg',
      description: 'Passionné par le développement web moderne, spécialisé dans les technologies Angular et Spring Boot. Je m\'engage à créer des expériences utilisateur exceptionnelles.',
      skills: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'MySQL', 'Docker']
    },
    {
      name: 'Mohamed Amine Ouerfelli',
      age: 21,
      role: 'Développeur Full-Stack',
      email: 'aminewerfelli20@gmail.com',
      education: 'Étudiant à l\'ISET de Rades Spécialité developpement systemes d information',
      image: 'assets/images/amine.jpg',
      description: 'Expert en développement frontend et design d\'interface. Je me concentre sur la création d\'applications intuitives et esthétiques qui améliorent la vie des utilisateurs.',
      skills: ['React', 'Node.js', 'UI/UX Design', 'MongoDB', 'Figma', 'AWS']
    }
  ];

  features = [
    {
      icon: '🎯',
      title: 'Suivi Intelligent',
      description: 'Des outils avancés pour suivre et analyser vos habitudes quotidiennes'
    },
    {
      icon: '📊',
      title: 'Analytics Détaillés',
      description: 'Visualisez vos progrès avec des graphiques et statistiques en temps réel'
    },
    {
      icon: '🔥',
      title: 'Système de Motivation',
      description: 'Restez motivé avec des séries, défis et récompenses personnalisées'
    },
    {
      icon: '🎨',
      title: 'Design Épuré',
      description: 'Interface moderne et intuitive pour une expérience utilisateur optimale'
    }
  ];

  stats = [
    { number: '10K+', label: 'Utilisateurs Satisfaits' },
    { number: '95%', label: 'Taux de Réussite' },
    { number: '50K+', label: 'Habitudes Suivies' },
    { number: '24/7', label: 'Support Actif' }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    // Les animations sont gérées via CSS
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulation d'envoi
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
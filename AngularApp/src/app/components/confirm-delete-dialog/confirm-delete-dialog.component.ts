import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service'; // Importa il tuo servizio
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private userService: UserService, // Inietta il servizio
    private auth:AuthService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.loading = true;
    this.userService.deleteUser(this.auth.getId()).subscribe(() => { // Assumendo che deleteUser() non richieda ID
      this.dialogRef.close(true); // Chiude il dialogo e indica che l'eliminazione è completata
    }, () => {
      this.loading = false; // Ripristina lo stato di caricamento in caso di errore
    });
  }
}

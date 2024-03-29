import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/shared/services/loginService/login.service';
import { UserService } from '../shared/services/userService/user.service';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { LoginComponent } from './pages/login/login.component';
import { LojaService } from './pages/loja/lojaService/loja.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'livraria-fe';
  codigo_carrinho = 0;

  constructor(
	public loginSrv: LoginService,
	private lojaSrv: LojaService,
	private dialog: MatDialog,
	private router: Router,
	public userloginSrv: UserService,
	private toast: NgToastService,
	) {
		this.obterCarrinho();
	}



	abrirModalLogin() {
		const dialogRef = this.dialog.open(LoginComponent, {
			width: '400px'
			// outros configs
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
		this.obterCarrinho()
	}

	handleConta() {
		this.loginSrv.getMe().subscribe(
			(response: any) => {
				this.userloginSrv.setLoggedUser(response);
				this.router.navigate(['/perfil']);
			},
			(error) => {
				this.abrirModalLogin();
			}
		)
	}

	handleCarrinho() {
		// nao deve abrir o carrinho na pagina de pgto
		if(this.router.url === '/checkout'){
			this.toast.error({
				detail: 'Impossivel abrir o carrinho durante a finalização de uma compra.',
				summary: undefined,
				duration: 5000,
				position: 'bottomRight'
			})
			return;
		}

		const dialogRef = this.dialog.open(CarrinhoComponent, {
			width: '600px'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

	redirecionarHome(): void {
		this.router.navigate(['/loja']);
	}

	obterCarrinho() {
		let cpf = this.userloginSrv.getCpf();

		if (cpf) {
			this.lojaSrv.inicializarCarrinho(cpf).subscribe(
				(response: any) => {
					this.codigo_carrinho = response.codigo;
					this.userloginSrv.setCodCarrinho(response.codigo);
				},
				(error) => {
				}
			);
		}
	}
}

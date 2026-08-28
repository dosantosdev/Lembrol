!macro customWelcomePage

  !define MUI_WELCOMEPAGE_TITLE "Bem-vindo ao Lembrol"
  !define MUI_WELCOMEPAGE_TEXT "O Lembrol ajuda você a organizar seus projetos e tarefas, mantendo seus lembretes sempre por perto.$\r$\n$\r$\nHá algo que precisa da sua atenção.$\r$\n$\r$\nClique em Próximo para continuar a instalação."

  !insertmacro MUI_PAGE_WELCOME

!macroend


!macro customUnWelcomePage

  !define MUI_WELCOMEPAGE_TITLE "Desinstalar o Lembrol"
  !define MUI_WELCOMEPAGE_TEXT "O Lembrol está instalado neste computador.$\r$\n$\r$\nSe você continuar, o Lembrol será removido do computador.$\r$\n$\r$\nClique em Próximo para continuar a desinstalação."

  !insertmacro MUI_UNPAGE_WELCOME

!macroend

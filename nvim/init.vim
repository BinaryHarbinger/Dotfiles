call plug#begin('~/.vim/plugged')

Plug 'morhetz/gruvbox'

call plug#end()

" Taban ayarlar
set number          " Satır numarası
set relativenumber  " Göreceli numaralar
set tabstop=4       " Tab genişliği
set shiftwidth=4
set expandtab       " Tab yerine boşluk
set autoindent
syntax on
set termguicolors
set whichwrap+=<,>,h,l

" Theme
colorscheme binaryharbinger
set background=dark
set termguicolors

" Code pharanthesis and cursor matching
set showmatch
set cursorline

" Dosyayı otomatik kaydetmeden önce yedekleme kapatma
set nobackup
set nowritebackup
set noswapfile


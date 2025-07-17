-- Basic settings: tabs, line numbers, colors, etc.
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.autoindent = true
vim.opt.termguicolors = true
vim.opt.cursorline = true
vim.opt.showmatch = true
vim.opt.backup = false
vim.opt.writebackup = false
vim.opt.swapfile = false
vim.opt.whichwrap:append("<,>,h,l")

-- Add config directory to runtimepath for colorscheme loading
vim.opt.rtp:append("~/.config/nvim")

-- Lazy.nvim installation path
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Plugins setup using lazy.nvim
require("lazy").setup({
  {
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
  },
  {
    "nvim-telescope/telescope-file-browser.nvim",
    dependencies = { "nvim-telescope/telescope.nvim" },
  },
  {
    "windwp/nvim-autopairs",
    config = function()
      require("nvim-autopairs").setup{}
    end,
  },
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup {
        ensure_installed = {
          "c", "cpp", "python", "lua", "javascript", "bash", "rust", "css", "yaml", "json"
        },
        highlight = {
          enable = true,
          additional_vim_regex_highlighting = false,
        },
        indent = {
          enable = true,
        },
      }
    end,
  },

  -- coq_nvim for completion
  { "ms-jpq/coq_nvim", branch = "coq" },
  { "ms-jpq/coq.artifacts", branch = "artifacts" },
  { "neovim/nvim-lspconfig" },
})

-- Load telescope-file-browser extension
require("telescope").load_extension("file_browser")

-- coq_nvim ayarları
vim.g.coq_settings = {
  auto_start = 'shut-up',  -- otomatik başlasın
}

-- coq + LSP entegrasyonu
local lspconfig = require("lspconfig")
local coq = require("coq")

-- LSP sunucularını coq ile başlat
lspconfig.pyright.setup(coq.lsp_ensure_capabilities{})
lspconfig.clangd.setup(coq.lsp_ensure_capabilities{})
lspconfig.lua_ls.setup(coq.lsp_ensure_capabilities({
  settings = {
    Lua = {
      diagnostics = {
        globals = { "vim" },
      },
    },
  }
}))

-- Telescope keymaps with hidden file support
vim.keymap.set("n", "<leader>ff", function()
  require("telescope.builtin").find_files({
    hidden = true,
    no_ignore = true,
    file_ignore_patterns = { ".git/" },
  })
end, { desc = "Find Files (includes hidden)" })

vim.keymap.set("n", "<leader>fg", function()
  require("telescope.builtin").live_grep({
    additional_args = function()
      return { "--hidden", "--no-ignore" }
    end,
  })
end, { desc = "Live Grep (includes hidden)" })

vim.keymap.set("n", "<leader>fb", function()
  require("telescope").extensions.file_browser.file_browser({
    hidden = true
  })
end, { desc = "Telescope File Browser (includes hidden)" })

-- Load your custom vim colorscheme (binaryharbinger)
vim.cmd("colorscheme binaryharbinger")

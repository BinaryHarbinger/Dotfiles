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

-- Ensure lazy.nvim is installed
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Plugin setup using lazy.nvim
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
    "denialofsandwich/sudo.nvim",
    dependencies = { "MunifTanjim/nui.nvim" },
    config = true,
  },
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup {
        ensure_installed = { "c", "cpp", "python", "lua", "javascript", "bash", "rust", "css", "yaml", "json" },
        highlight = { enable = true, additional_vim_regex_highlighting = false },
        indent    = { enable = true },
      }
    end,
  },

  -- Completion framework and sources
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "hrsh7th/cmp-nvim-lsp",
      "L3MON4D3/LuaSnip",            -- Snippet engine
      "saadparwaiz1/cmp_luasnip",   -- Snippet completions
    },
    config = function()
      local cmp = require("cmp")
      local luasnip = require("luasnip")

      cmp.setup({
        snippet = {
          expand = function(args)
            luasnip.lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<Tab>"] = cmp.mapping.select_next_item(),
          ["<S-Tab>"] = cmp.mapping.select_prev_item(),
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" },
          { name = "luasnip" },
        }, {
          { name = "buffer" },
          { name = "path" },
        }),
      })
    end,
  },

  -- Language Server Protocol configurations
  {
    "neovim/nvim-lspconfig",
    config = function()
      local lspconfig = require("lspconfig")

      -- C/C++ language server
      lspconfig.clangd.setup{}

      -- Python language server
      lspconfig.pyright.setup{}

      -- Lua language server
      lspconfig.lua_ls.setup{}

      -- JavaScript/TypeScript language server
      lspconfig.ts_ls.setup{}

      -- Bash language server
      lspconfig.bashls.setup{}

      -- Rust language server
      lspconfig.rust_analyzer.setup{}

      -- CSS language server
      lspconfig.cssls.setup{}

      -- YAML language server
      lspconfig.yamlls.setup{}

      -- JSON language server
      lspconfig.jsonls.setup{}
    end,
  },
})

-- Load telescope file browser extension
require("telescope").load_extension("file_browser")

-- Telescope key mappings for hidden files and project search
vim.keymap.set("n", "<leader>ff", function()
  require("telescope.builtin").find_files({ hidden = true, no_ignore = true, file_ignore_patterns = { ".git/" } })
end, { desc = "Find Files (includes hidden)" })

vim.keymap.set("n", "<leader>fg", function()
  require("telescope.builtin").live_grep({ additional_args = function() return { "--hidden", "--no-ignore" } end })
end, { desc = "Live Grep (includes hidden)" })

vim.keymap.set("n", "<leader>fb", function()
  require("telescope").extensions.file_browser.file_browser({ hidden = true })
end, { desc = "Telescope File Browser (includes hidden)" })

-- Load custom colorscheme
vim.cmd("colorscheme binaryharbinger")

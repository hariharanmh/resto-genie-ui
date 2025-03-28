# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "bradlc.vscode-tailwindcss"
      "streetsidesoftware.code-spell-checker"
      "gruntfuggly.todo-tree"
      "coenraads.bracket-pair-colorizer-2"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "src/App.tsx" "src/App.ts" "src/App.jsx" "src/App.js" ];
        # Install packages from VS Marketplace
        msget = ''
          cd ./msget
          chmod +x ./msget.sh
          ./msget.sh extensions.txt
        '';
      };
      # Runs when a workspace restarted
      onStart = {
        msget = ''
          cd ./msget
          chmod +x ./msget.sh
          ./msget.sh extensions.txt
        '';
      };
    };
    # # Enable previews and customize configuration
    # previews = {
    #   enable = true;
    #   previews = {
    #     web = {
    #       command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
    #       manager = "web";
    #     };
    #   };
    # };
  };
}

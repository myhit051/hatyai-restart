import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">HY</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Hat Yai Restart</h1>
        </div>
        <Avatar className="h-9 w-9 ring-2 ring-primary/20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=hatyai" alt="User" />
          <AvatarFallback className="bg-primary-light text-primary font-medium">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;

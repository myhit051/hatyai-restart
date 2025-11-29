import { Shield, ClipboardList, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatusCardProps {
  userName: string;
}

const StatusCard = ({ userName }: StatusCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground p-5 rounded-2xl shadow-action animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">สวัสดี, {userName}</h2>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm opacity-90">สถานะของคุณ: ปลอดภัย</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-3 border-t border-primary-foreground/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs opacity-75">งานที่แจ้ง</p>
            <p className="text-lg font-bold">2</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs opacity-75">การบริจาค</p>
            <p className="text-lg font-bold">1</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusCard;

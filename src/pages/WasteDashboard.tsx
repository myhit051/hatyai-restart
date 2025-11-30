import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWasteStore } from "@/store/wasteStore";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WasteType, WasteStatus } from "@/store/wasteStore";
import {
  TrashIcon,
  PlusIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

const WasteDashboard = () => {
  const { user } = useAuthStore();
  const { wasteReports, createReport, assignCollection, updateCollectionStatus, loadReports, myReports, activeCollections } = useWasteStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    location: "",
    wasteType: "other" as WasteType,
    estimatedVolume: "",
    description: "",
    urgencyLevel: "medium" as "low" | "medium" | "high" | "critical",
    accessibilityNotes: "",
    environmentalRisk: "low" as "low" | "medium" | "high"
  });

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleCreateReport = async () => {
    await createReport(newReport);
    setNewReport({
      location: "",
      wasteType: "other",
      estimatedVolume: "",
      description: "",
      urgencyLevel: "medium",
      accessibilityNotes: "",
      environmentalRisk: "low"
    });
    setIsCreateDialogOpen(false);
  };

  const handleAssignCollection = async (reportId: string) => {
    await assignCollection(reportId, "team-1"); // Mock team ID
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case "assigned":
        return <MapPinIcon className="h-4 w-4 text-blue-500" />;
      case "in-collection":
        return <TruckIcon className="h-4 w-4 text-orange-500" />;
      case "collected":
        return <PlusIcon className="h-4 w-4 text-green-500" />;
      default:
        return <TrashIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const wasteTypeOptions = [
    { value: "construction", label: "วัสดุก่อสร้าง" },
    { value: "hazardous", label: "ขยะอันตราย" },
    { value: "electronic", label: "ขยะอิเล็กทรอนิกส์" },
    { value: "organic", label: "ขยะอินทรีย์" },
    { value: "household", label: "ขยะบ้านเรือน" },
    { value: "other", label: "อื่นๆ" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ระบบจัดการขยะ</h1>
            <p className="text-muted-foreground">รายงานและจัดการขยะขนาดใหญ่จากน้ำท่วม</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                รายงานขยะ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>รายงานขยะใหม่</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">สถานที่</Label>
                  <Input
                    id="location"
                    value={newReport.location}
                    onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="ที่อยู่ที่พบขยะ"
                  />
                </div>

                <div>
                  <Label htmlFor="wasteType">ประเภทขยะ</Label>
                  <Select
                    value={newReport.wasteType}
                    onValueChange={(value: WasteType) => setNewReport(prev => ({ ...prev, wasteType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estimatedVolume">ปริมาณโดยประมาณ</Label>
                  <Input
                    id="estimatedVolume"
                    value={newReport.estimatedVolume}
                    onChange={(e) => setNewReport(prev => ({ ...prev, estimatedVolume: e.target.value }))}
                    placeholder="เช่น 1-2 ตัน, 5-10 กระสอบ"
                  />
                </div>

                <div>
                  <Label htmlFor="description">รายละเอียด</Label>
                  <Textarea
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="อธิบายประเภทขยะและสถานการณ์..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="urgency">ความเร่งด่วน</Label>
                    <Select
                      value={newReport.urgencyLevel}
                      onValueChange={(value: "low" | "medium" | "high" | "critical") => setNewReport(prev => ({ ...prev, urgencyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">ต่ำ</SelectItem>
                        <SelectItem value="medium">ปานกลาง</SelectItem>
                        <SelectItem value="high">สูง</SelectItem>
                        <SelectItem value="critical">ด่วนที่สุด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="environmentalRisk">ความเสี่ยงต่อสิ่งแวดล้อม</Label>
                    <Select
                      value={newReport.environmentalRisk}
                      onValueChange={(value: "low" | "medium" | "high") => setNewReport(prev => ({ ...prev, environmentalRisk: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">ต่ำ</SelectItem>
                        <SelectItem value="medium">ปานกลาง</SelectItem>
                        <SelectItem value="high">สูง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="accessibility">ข้อมูลการเข้าถึง (ถ้ามี)</Label>
                  <Textarea
                    id="accessibility"
                    value={newReport.accessibilityNotes}
                    onChange={(e) => setNewReport(prev => ({ ...prev, accessibilityNotes: e.target.value }))}
                    placeholder="เช่น ต้องใช้รถขนาดใหญ่, พื้นที่ลื่น, จำกัดเวลา..."
                    rows={2}
                  />
                </div>

                <Button onClick={handleCreateReport} className="w-full">
                  รายงานขยะ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">รายงานทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wasteReports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {wasteReports.filter(report => report.status === "reported").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">กำลังเก็บ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {wasteReports.filter(report => report.status === "in-collection").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ความเสี่ยงสูง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {wasteReports.filter(report => report.environmentalRisk === "high").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Reports */}
          <Card>
            <CardHeader>
              <CardTitle>รายงานของฉัน</CardTitle>
              <CardDescription>รายงานขยะที่คุณแจ้งไว้</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myReports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  ยังไม่มีรายงานจากคุณในขณะนี้
                </p>
              ) : (
                myReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(report.status)}
                          <Badge variant={getRiskBadgeVariant(report.environmentalRisk)}>
                            ความเสี่ยง: {report.environmentalRisk === "high" && "สูง"}
                            {report.environmentalRisk === "medium" && "ปานกลาง"}
                            {report.environmentalRisk === "low" && "ต่ำ"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📍 {report.location}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📏 ปริมาณ: {report.estimatedVolume}
                    </div>

                    {report.collectionTeamName && (
                      <div className="text-xs text-muted-foreground">
                        🚛 ทีมเก็บ: {report.collectionTeamName}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Available Collections */}
          <Card>
            <CardHeader>
              <CardTitle>รายงานที่รอดำเนินการ</CardTitle>
              <CardDescription>รายงานขยะที่ต้องการทีมเก็บ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCollections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  ไม่มีรายงานที่รอดำเนินการในขณะนี้
                </p>
              ) : (
                wasteReports
                  .filter(report => report.status === "reported")
                  .map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusIcon(report.status)}
                            <Badge variant={getRiskBadgeVariant(report.environmentalRisk)}>
                              ความเสี่ยง: {report.environmentalRisk === "high" && "สูง"}
                              {report.environmentalRisk === "medium" && "ปานกลาง"}
                              {report.environmentalRisk === "low" && "ต่ำ"}
                            </Badge>
                          </div>
                        </div>

                        {user?.role === 'coordinator' && (
                          <Button
                            size="sm"
                            onClick={() => handleAssignCollection(report.id)}
                          >
                            มอบหมายทีม
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        📍 {report.location} • 👤 {report.reporterName}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        📏 ปริมาณ: {report.estimatedVolume}
                      </div>

                      {report.accessibilityNotes && (
                        <div className="text-xs text-muted-foreground">
                          🚛 {report.accessibilityNotes}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;
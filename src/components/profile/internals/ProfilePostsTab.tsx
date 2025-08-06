import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const ProfilePostsTab = () => {
  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">
              Latest research on cardiology
            </h3>
            <p className="text-gray-700 mb-3">
              Published a new paper on the effects of...
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>2 days ago</span>
              <span>Â·</span>
              <span>42 likes</span>
            </div>
          </div>
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">Webinar announcement</h3>
            <p className="text-gray-700 mb-3">
              Join us for a webinar on AI in pharmaceuticals...
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>1 week ago</span>
              <span>Â·</span>
              <span>18 likes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

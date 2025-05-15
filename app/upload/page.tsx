import { UploadForm } from "@/components/upload-form"
import { RecentUploads } from "@/components/recent-uploads"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload New Bill</h1>
        <p className="text-muted-foreground">Add a new utility bill to your tracker</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Bill</TabsTrigger>
          <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-2">Upload New Utility Bill</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Take a photo of your bill to extract data</p>
            <UploadForm />
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <RecentUploads />
        </TabsContent>
      </Tabs>
    </div>
  )
}

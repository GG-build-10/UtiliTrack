import { UploadForm } from "@/components/upload-form"
import { RecentUploads } from "@/components/recent-uploads"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Barcode, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
          <div className="bg-gradient-to-br from-sage-50 to-teal-50 dark:from-sage-950/30 dark:to-teal-950/30 rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-2">Choose Upload Method</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Select how you want to add your utility bill</p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-2 border-sage-200 hover:border-sage-400 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center mb-4">
                      <Barcode className="h-8 w-8 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Scan Barcode</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Quickly extract bill information by scanning the barcode on your utility bill
                    </p>
                    <Button className="bg-sage-600 hover:bg-sage-700">Scan Barcode</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-teal-200 hover:border-teal-400 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Upload Image</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Upload a photo of your bill to extract data using OCR technology
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700">Upload Image</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <UploadForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <RecentUploads />
        </TabsContent>
      </Tabs>
    </div>
  )
}

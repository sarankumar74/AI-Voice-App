import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code2, Zap, Shield, Globe } from "lucide-react";

const ApiDocs = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const curlExample = `curl -X POST "${baseUrl}/analyze-voice" \\
  -H "Content-Type: application/json" \\
  -d '{
    "audioUrl": "https://example.com/audio.mp3",
    "language": "auto"
  }'`;

  const jsExample = `const response = await fetch("${baseUrl}/analyze-voice", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    audioUrl: "https://example.com/audio.mp3",
    language: "auto"
  })
});

const result = await response.json();
console.log(result);`;

  const pythonExample = `import requests

response = requests.post(
    "${baseUrl}/analyze-voice",
    json={
        "audioUrl": "https://example.com/audio.mp3",
        "language": "auto"
    }
)

result = response.json()
print(result)`;

  const requestBody = `{
  "audioData": "base64_encoded_audio_string",  // Option 1: Base64 audio
  "audioUrl": "https://example.com/audio.mp3", // Option 2: Audio URL
  "language": "auto",                          // auto, english, tamil, malayalam, hindi, telugu
  "fileName": "sample.mp3"                     // Optional: filename for context
}`;

  const responseExample = `{
  "classification": "human",
  "confidence": 87,
  "language": "English",
  "languageSource": "detected",
  "reasoning": "The audio exhibits natural prosodic variations, organic breath sounds integrated with speech, and genuine emotional inflection that aligns with human speech patterns.",
  "markers": {
    "prosody": 85,
    "breath": 82,
    "emotion": 89,
    "fluency": 91
  }
}`;

  return (
    <div className="min-h-screen gradient-hero">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
            REST API v1.0
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Voice Detector API
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrate voice authentication into your applications. Detect AI-generated speech with our forensic-grade analysis API.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Fast Response</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get analysis results in seconds with our optimized AI pipeline
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Multi-Language</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Supports Tamil, English, Malayalam, Hindi, and Telugu with auto-detection
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Audio data is processed securely and not stored after analysis
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* API Reference */}
        <Card className="bg-card/50 backdrop-blur border-border/50 mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle>API Reference</CardTitle>
            </div>
            <CardDescription>
              Complete documentation for the Voice Analysis endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endpoint */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Endpoint
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-success/10 text-success border-success/20">
                  POST
                </Badge>
                <code className="bg-muted px-3 py-1.5 rounded-md text-sm font-mono break-all">
                  {baseUrl}/analyze-voice
                </code>
              </div>
            </div>

            {/* Request Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Request Body
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(requestBody, "request")}
                  className="h-8"
                >
                  {copiedSection === "request" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {requestBody}
              </pre>
            </div>

            {/* Parameters Table */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Parameters
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Parameter</th>
                      <th className="text-left px-4 py-2 font-medium">Type</th>
                      <th className="text-left px-4 py-2 font-medium">Required</th>
                      <th className="text-left px-4 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono text-primary">audioData</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">*</td>
                      <td className="px-4 py-2 text-muted-foreground">Base64 encoded audio data</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="px-4 py-2 font-mono text-primary">audioUrl</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">*</td>
                      <td className="px-4 py-2 text-muted-foreground">Public URL of audio file</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono text-primary">language</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">No</td>
                      <td className="px-4 py-2 text-muted-foreground">auto, english, tamil, malayalam, hindi, telugu</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="px-4 py-2 font-mono text-primary">fileName</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">No</td>
                      <td className="px-4 py-2 text-muted-foreground">Original filename for context</td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
                  * Either audioData or audioUrl is required
                </div>
              </div>
            </div>

            {/* Response */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Response (200 OK)
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(responseExample, "response")}
                  className="h-8"
                >
                  {copiedSection === "response" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {responseExample}
              </pre>
            </div>

            {/* Response Fields */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Response Fields
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Field</th>
                      <th className="text-left px-4 py-2 font-medium">Type</th>
                      <th className="text-left px-4 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono text-primary">classification</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2 text-muted-foreground">"human" or "ai"</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="px-4 py-2 font-mono text-primary">confidence</td>
                      <td className="px-4 py-2">number</td>
                      <td className="px-4 py-2 text-muted-foreground">Confidence score (0-100)</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono text-primary">language</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2 text-muted-foreground">Detected or selected language</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="px-4 py-2 font-mono text-primary">languageSource</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2 text-muted-foreground">"detected" or "selected"</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono text-primary">reasoning</td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2 text-muted-foreground">Expert explanation of classification</td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="px-4 py-2 font-mono text-primary">markers</td>
                      <td className="px-4 py-2">object</td>
                      <td className="px-4 py-2 text-muted-foreground">Naturalness scores (prosody, breath, emotion, fluency)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="bg-card/50 backdrop-blur border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>
              Quick start examples in popular languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="curl">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(curlExample, "curl")}
                    className="absolute right-2 top-2 h-8"
                  >
                    {copiedSection === "curl" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {curlExample}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="javascript">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(jsExample, "js")}
                    className="absolute right-2 top-2 h-8"
                  >
                    {copiedSection === "js" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {jsExample}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="python">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(pythonExample, "python")}
                    className="absolute right-2 top-2 h-8"
                  >
                    {copiedSection === "python" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {pythonExample}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
            <CardDescription>
              HTTP status codes and error responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Status</th>
                    <th className="text-left px-4 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        200
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Success - Analysis completed</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        400
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Bad Request - Missing or invalid parameters</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        429
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Rate Limited - Too many requests</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        500
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Server Error - Analysis failed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ApiDocs;

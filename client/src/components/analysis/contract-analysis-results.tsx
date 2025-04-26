    "use client"

    import {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState} from "react"
    import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
    import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
    import {Badge} from "@/components/ui/badge"
    import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
    import {InfoIcon, ShieldAlert, ShieldCheck, AlertTriangle, Loader} from 'lucide-react'
    import {Progress} from "@/components/ui/progress"
    import {Separator} from "@/components/ui/separator"
    import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
    import { useQuery } from "@tanstack/react-query"
    import { api } from "@/lib/api"
    // import router from "next/router"

    import { useRouter } from "next/router";
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"


    interface IPrivacyRisk {
        risk: string
        explanation: string
        severity: "low" | "medium" | "high"
    }

    interface IDataSharing {
        entity: string
        purpose: string
    }

    interface IPrivacyAnalysis {
        privacyRisks: IPrivacyRisk[]
        summary: string
        recommendations: string[]
        keyClauses: string[]
        legalCompliance: string
        dataCollected: string[]
        dataUsage: string[]
        dataSharing: IDataSharing[]
        userRights: string[]
        dataRetentionPeriod: string
        trackingTechnologies: string[]
        policyJurisdiction: string[]
        gdprCompliance: boolean
        ccpaCompliance: boolean
        otherRegulations: string[]
        overallScore:any
    }

    interface PrivacyAnalysisResultsProps {
        // analysisResults: IPrivacyAnalysis,
        isActive?: boolean
        id:unknown
    }

    export default function     PrivacyAnalysisResults({isActive,id}: PrivacyAnalysisResultsProps) {
        const { user } = useCurrentUser();
        // console.log("I am user",user);
        isActive=user.isPremium
        
        const [activeTab, setActiveTab] = useState("overview")
        const {
            data: analysisResults,
            isLoading,
            isError,
        } = useQuery({
            queryKey: ["privacyAnalysisResults"],
            queryFn: async () => {
                const res = await api.get(`contracts/contract/${id}`)
                return res.data
            },
        })
        console.log(analysisResults)
        
        if (isLoading) return <div>Loading...</div>
        if (isError) return <div>Error loading analysis results.</div>
        
        // const handleUpgradeClick = () => {
        //     // Redirect to /dashboard/settings
        //     router.push("/dashboard/settings");
        // };

        const getSeverityColor = (severity: string) => {
            switch (severity) {
                case "high":
                    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                case "medium":
                    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                case "low":
                    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                default:
                    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                }
        }

        const getSeverityIcon = (severity: string) => {
            switch (severity) {
                case "high":
                    return <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400"/>
                case "medium":
                    return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400"/>
                case "low":
                    return <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400"/>
                default:
                    return <InfoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
            }
        }

        const calculateComplianceScore = () => {
            // let score = 50 // Base score

            // // Add points for compliance
            // if (analysisResults.gdprCompliance) score += 15
            // if (analysisResults.ccpaCompliance) score += 15
            
            // // Deduct points for risks
            // const highRisks = analysisResults.privacyRisks.filter((r) => r.severity === "high").length
            // const mediumRisks = analysisResults.privacyRisks.filter((r) => r.severity === "medium").length
            
            // score -= highRisks * 10
            // score -= mediumRisks * 5

            // // Add points for user rights and transparency
            // if (analysisResults.userRights.length > 0) score += 10
            // if (analysisResults.dataRetentionPeriod !== "Unknown") score += 5
            
            // // Ensure score is between 0 and 100
            // return Math.max(0, Math.min(100, score))
            return analysisResults.overallScore
        }
        
        const complianceScore = calculateComplianceScore()

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Privacy Policy Analysis</h1>
                    <p className="text-muted-foreground">
                        Analysis of privacy practices, data collection, and regulatory compliance
                    </p>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Compliance Score</CardTitle>
                        <CardDescription>Overall privacy compliance rating</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            {/*<div className="text-4xl font-bold mb-2">{complianceScore}%</div>*/}
                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color:
                                        complianceScore >= 70
                                            ? "#155724" // Dark Green
                                            : complianceScore >= 40
                                                ? "#856404" // Dark Yellow
                                                : "#721c24", // Dark Red
                                }}
                            >
                                {complianceScore}%
                            </p>
                            <Progress value={complianceScore} className="w-full h-2 mb-2"/>
                            <span
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    backgroundColor:
                                        complianceScore >= 70
                                            ? "#d4edda" // Light green
                                            : complianceScore >= 40
                                                ? "#fff3cd" // Light yellow
                                                : "#f8d7da", // Light red
                                    color:
                                        complianceScore >= 70
                                            ? "#155724" // Dark green text
                                            : complianceScore >= 40
                                                ? "#856404" // Dark yellow text
                                                : "#721c24", // Dark red text
                                }}
                            >
  {complianceScore >= 70
      ? "Good privacy practices"
      : complianceScore >= 40
          ? "Some privacy concerns"
          : "Significant privacy issues"}
</span>

                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Regulatory Compliance</CardTitle>
                        <CardDescription>Adherence to privacy regulations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <Badge variant={analysisResults.gdprCompliance ? "default" : "outline"}>
                                    GDPR
                                </Badge>
                                <span className="text-sm">
                  {analysisResults.gdprCompliance ? "Compliant" : "Non-compliant"}
                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={analysisResults.ccpaCompliance ? "default" : "outline"}>
                                    CCPA
                                </Badge>
                                <span className="text-sm">
                  {analysisResults.ccpaCompliance ? "Compliant" : "Non-compliant"}
                </span>
                            </div>
                        </div>
                        {analysisResults.otherRegulations.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-1">Other Regulations:</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysisResults.otherRegulations.map((reg:any, index:any) => (
                                        <Badge key={index} variant="outline">
                                            {reg}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Risk Assessment</CardTitle>
                        <CardDescription>Privacy risks identified</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span>High Risk Issues</span>
                                <Badge variant="outline"
                                       className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    {analysisResults.privacyRisks.filter((r: { severity: string }) => r.severity === "high").length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Medium Risk Issues</span>
                                <Badge variant="outline"
                                       className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    {analysisResults.privacyRisks.filter((r: { severity: string }) => r.severity === "medium").length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Low Risk Issues</span>
                                <Badge variant="outline"
                                       className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    {analysisResults.privacyRisks.filter((r: { severity: string }) => r.severity === "low").length}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="data">Data Handling</TabsTrigger>
                    <TabsTrigger value="rights">User Rights</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Policy Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg leading-relaxed mb-6">{analysisResults.summary}</p>

                            <h3 className="text-lg font-semibold mb-2">Legal Compliance</h3>
                            <p className="mb-4">{analysisResults.legalCompliance}</p>

                            <h3 className="text-lg font-semibold mb-2">Key Clauses</h3>
                            {analysisResults.keyClauses.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {analysisResults.keyClauses.map((clause: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                                        <li key={index}>{clause}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No key clauses identified</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>



                <TabsContent value="risks" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Risks</CardTitle>
                            <CardDescription>Issues identified in the privacy policy</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analysisResults.privacyRisks.length > 0 ? (
                                <div className="space-y-4">
                                    {analysisResults.privacyRisks.map((risk: { severity: string; risk: string; explanation: string }, index:number) => (
                                        <div key={index}
                                             className={index >= 3 && !isActive ? "blur-sm pointer-events-none select-none" : ""}
                                        >
                                            <Alert className="border-l-4"
                                                   style={{borderLeftColor: risk.severity === "high" ? "#ef4444" : risk.severity === "medium" ? "#f59e0b" : "#10b981"}}>
                                                <div className="flex items-start">
                                                    {getSeverityIcon(risk.severity)}
                                                    <div className="ml-3 w-full">
                                                        <div className="flex justify-between items-center">
                                                            <AlertTitle>{risk.risk}</AlertTitle>
                                                            <Badge className={getSeverityColor(risk.severity)}>
                                                                {risk.severity.toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <AlertDescription className="mt-1">
                                                            {risk.explanation}
                                                        </AlertDescription>
                                                    </div>
                                                </div>
                                            </Alert>
                                        </div>
                                    ))}
                                    {/* Subscription Prompt */}
                                    {!isActive && analysisResults.privacyRisks.length > 3 && (
                                        <div className="text-center py-4 bg-gray-100 rounded-lg">
                                            <h3 className="text-lg font-medium mb-2">Unlock More Privacy Risks</h3>
                                            <p className="text-muted-foreground mb-3">Subscribe to access the full list of privacy risks.</p>
                                            <Link href="/dashboard/settings">
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                                Upgrade Now
                                            </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-4"/>
                                    <h3 className="text-lg font-medium mb-1">No Privacy Risks Detected</h3>
                                    <p className="text-muted-foreground">
                                        The privacy policy appears to be compliant with best practices.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="data" className="mt-4">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all ${!isActive ? "blur-sm pointer-events-none" : ""}`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Collection</CardTitle>
                                <CardDescription>Types of data collected from users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysisResults.dataCollected.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analysisResults.dataCollected.map((data:string, index: Key | null | undefined) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                                {data}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">No data collection details specified</p>
                                )}

                                <Separator className="my-4"/>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Data Retention Period</h3>
                                    <p>{analysisResults.dataRetentionPeriod}</p>
                                </div>

                                {analysisResults.trackingTechnologies.length > 0 && (
                                    <>
                                        <Separator className="my-4"/>
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Tracking Technologies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResults.trackingTechnologies.map((tech:string, index: Key | null | undefined) => (
                                                    <Badge key={index} variant="outline">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Usage & Sharing</CardTitle>
                                <CardDescription>How collected data is used and shared</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Data Usage</h3>
                                    {analysisResults.dataUsage.length > 0 ? (
                                        <ul className="space-y-2">
                                            {analysisResults.dataUsage.map((usage:string, index:Key) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                                                    {usage}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground">No data usage details specified</p>
                                    )}
                                </div>

                                <Separator className="my-4"/>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Data Sharing</h3>
                                    {analysisResults.dataSharing.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Entity</TableHead>
                                                    <TableHead>Purpose</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {analysisResults.dataSharing.map((sharing: { entity: string ;purpose:string }, index: Key | null | undefined) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{sharing.entity}</TableCell>
                                                        <TableCell>{sharing.purpose}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted-foreground">No data sharing details specified</p>
                                    )}
                                </div>

                                {analysisResults.policyJurisdiction.length > 0 && (
                                    <>
                                        <Separator className="my-4"/>
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Policy Jurisdiction</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResults.policyJurisdiction.map((jurisdiction:string, index:number) => (
                                                    <Badge key={index} variant="outline">
                                                        {jurisdiction}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {!isActive && (
                        <div className="text-center py-4 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Unlock To See Data Collection and Usage Details</h3>
                            <p className="text-muted-foreground mb-3">Subscribe to access the full list .</p>
                            <Link href="/dashboard/settings">
                            <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Upgrade Now
                            </button>
                            </Link>
                        </div>
                    )}
                </TabsContent>


                <TabsContent value="rights" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Rights</CardTitle>
                            <CardDescription>Rights granted to users regarding their data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analysisResults.userRights.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysisResults.userRights.map((right:string, index:string) => (
                                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                            <ShieldCheck className="h-5 w-5 text-primary mt-0.5"/>
                                            <div>
                                                <p>{right}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4"/>
                                    <h3 className="text-lg font-medium mb-1">No User Rights Specified</h3>
                                    <p className="text-muted-foreground">
                                        The privacy policy does not clearly outline user rights regarding their data.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                            <CardDescription>Suggested improvements for the privacy policy</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analysisResults.recommendations.length > 0 ? (
                                <div className="space-y-4">
                                    {analysisResults.recommendations.map((recommendation:string, index:any) => (
                                        <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                                            <div
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                                                <span className="text-sm font-medium">{index + 1}</span>
                                            </div>
                                            <div>
                                                <p>{recommendation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No recommendations provided</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
function setIsMounted(arg0: boolean) {
    throw new Error("Function not implemented.")
}


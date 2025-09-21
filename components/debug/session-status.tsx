'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useAuthToken } from '@/lib/auth-middleware'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

export function SessionStatus() {
  const { user, sessionActive, accessToken, refreshSession } = useAuth()
  const { getAuthHeaders } = useAuthToken()
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testProtectedEndpoint = async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/protected', {
        method: 'GET',
        headers: headers as HeadersInit
      })

      if (response.ok) {
        const data = await response.json()
        setTestResult({ success: true, data })
      } else {
        const error = await response.json()
        setTestResult({ success: false, error })
      }
    } catch (error) {
      setTestResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshSession = async () => {
    setLoading(true)
    try {
      const success = await refreshSession()
      setTestResult({ 
        success, 
        message: success ? 'Session refreshed successfully' : 'Failed to refresh session' 
      })
    } catch (error) {
      setTestResult({ success: false, error: 'Refresh failed' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            Session Status
          </CardTitle>
          <CardDescription>Please log in to view session information</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            JWT Session Status
          </CardTitle>
          <CardDescription>
            Current authentication session information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Active</span>
                <Badge variant={sessionActive ? "default" : "destructive"}>
                  {sessionActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {user.uid.slice(0, 8)}...
                </code>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Access Token</span>
                <Badge variant={accessToken ? "default" : "secondary"}>
                  {accessToken ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Present
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Missing
                    </>
                  )}
                </Badge>
              </div>
              
              {accessToken && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Token Preview</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {accessToken.slice(0, 12)}...
                  </code>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              onClick={testProtectedEndpoint} 
              disabled={loading || !sessionActive}
              variant="outline"
            >
              Test Protected API
            </Button>
            
            <Button 
              onClick={handleRefreshSession} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Session
            </Button>
          </div>

          {testResult && (
            <Card className={`border-2 ${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">
                    {testResult.success ? 'API Test Successful' : 'API Test Failed'}
                  </span>
                </div>
                <pre className="text-xs bg-background p-2 rounded border overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;

namespace dpsprivatepreview
{
  public static class csrGenerator
  {
    [FunctionName("csrGenerator")]
    public static async Task<HttpResponseMessage> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");

      string subjectName = req.Query["subjectName"];

      string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      dynamic data = JsonConvert.DeserializeObject(requestBody);
      subjectName = subjectName ?? data?.subjectName;

      if (subjectName == null)
      {
        string html = @"<html><body>Please pass a subjectName on the query string or in the request body</body></html>";
        var response = new HttpResponseMessage(HttpStatusCode.OK);
        response.Content = new StringContent(html);
        response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
        return response;
      }
      else
      {
        var cert = GenerateCSRForClientCert(subjectName);
        var json = JsonConvert.SerializeObject(new
        {
          inputs = new { subjectName = subjectName },
          outputs = new { csr = cert }
        });

        return new HttpResponseMessage(HttpStatusCode.OK)
        {
          Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
      }
    }


    private static string GenerateCSRForClientCert(string subjectName)
    {
      var keyPair = System.Security.Cryptography.ECDsa.Create(System.Security.Cryptography.ECCurve.NamedCurves.nistP256);
      var certRequest = new CertificateRequest("CN=" + subjectName, keyPair, System.Security.Cryptography.HashAlgorithmName.SHA256);

      var csr = certRequest.CreateSigningRequest();
      return Convert.ToBase64String(csr);
    }
  }
}

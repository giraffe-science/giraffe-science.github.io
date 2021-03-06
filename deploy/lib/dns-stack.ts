import {CertificateValidation, ICertificate} from "@aws-cdk/aws-certificatemanager";
import * as certs from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import {PublicHostedZone} from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import {Duration, StackProps} from "@aws-cdk/core";
import 'source-map-support/register';

function gandiMail(zone: PublicHostedZone) {
    const stack = zone.stack;
    // @	MX	300	10 spool.mail.gandi.net.
    // @	MX	300	50 fb.mail.gandi.net.
    new route53.MxRecord(stack, "mail", {
        values: [{
            priority: 10,
            hostName: "spool.mail.gandi.net."
        },
            {
                priority: 50,
                hostName: "fb.mail.gandi.net."
            }],
        zone,
        ttl: Duration.minutes(5),
    })
    // @	TXT	300	"v=spf1 include:_mailcust.gandi.net ?all"
    new route53.TxtRecord(stack, "spf", {
        values: ["v=spf1 include:_mailcust.gandi.net ?all"],
        comment: "https://support.dnsimple.com/articles/spf-record/",
        zone,
        ttl: Duration.minutes(5),
    })
    // _imap._tcp	SRV	300	0 0 0 .
    new route53.SrvRecord(stack, "imap", {
        recordName: "_imap._tcp",
        values: [{
            priority: 0,
            weight: 0,
            port: 0,
            hostName: "."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _imaps._tcp	SRV	300	0 1 993 mail.gandi.net.
    new route53.SrvRecord(stack, "imaps", {
        recordName: "_imaps._tcp",
        comment: "https://support.dnsimple.com/articles/srv-record/",
        values: [{
            priority: 200,
            weight: 1,
            port: 993,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _pop3._tcp	SRV	300	0 0 0 .
    new route53.SrvRecord(stack, "pop3", {
        recordName: "_pop3._tcp",
        values: [{
            priority: 0,
            weight: 0,
            port: 0,
            hostName: "."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _pop3s._tcp	SRV	300	10 1 995 mail.gandi.net.
    new route53.SrvRecord(stack, "pop3s", {
        recordName: "_pop3s._tcp",
        values: [{
            priority: 10,
            weight: 1,
            port: 995,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _submission._tcp	SRV	300	0 1 465 mail.gandi.net.
    new route53.SrvRecord(stack, "submission", {
        recordName: "_submission._tcp",
        values: [{
            priority: 0,
            weight: 1,
            port: 465,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // webmail	CNAME	300	webmail.gandi.net.
    new route53.CnameRecord(stack, "webmail", {
        recordName: "webmail",
        domainName: "webmail.gandi.net",
        zone,
        ttl: Duration.minutes(5),
    })
}

function githubPages(zone: PublicHostedZone) {
    // www	CNAME	300	giraffe-science.github.io.
    new route53.CnameRecord(zone.stack, "www", {
        recordName: "www",
        domainName: "giraffe-science.github.io.",
        zone,
        ttl: Duration.minutes(5),
    });
    // @	A	300	185.199.108.153
    // @	A	300	185.199.109.153
    // @	A	300	185.199.110.153
    // @	A	300	185.199.111.153
    new route53.ARecord(zone.stack, "github pages", {
        target: {
            values: [
                "185.199.108.153",
                "185.199.109.153",
                "185.199.110.153",
                "185.199.111.153"]
        },
        zone,
        ttl: Duration.minutes(5),
    });
}

export interface DnsStackProps extends StackProps {
    domainName: string
}

export class DnsStack extends cdk.Stack {
    readonly zone: PublicHostedZone;
    readonly rootEdgeCertificate: ICertificate;

    constructor(scope: cdk.Construct, id: string, env:string,props: DnsStackProps) {
        super(scope, id, {
            ...props,
            description: "Scientific Giraffe Hosted Zone",
            // terminationProtection is switched on.
            //
            // Each domain is configured with Gandi to point to a Route53 hosted zone's nameservers
            // Recreating the hosted zone changes the address of the nameservers
            // Updates to the nameservers take 24-48 hours to switch over, so deleting this stack
            // results in 24-48 hours of downtime.
            //
            // It is possible to manually update the stack template to mark the hosted zone as `DeletionPolicy: Retain`
            // and then delete the stack, which will keep the hosted zone, but it will not belong to any stack:
            // https://aws.amazon.com/premiumsupport/knowledge-center/delete-cf-stack-retain-resources/
            //
            // You can then import the same hosted zone into a new stack, leaving the nameservers unchanged:
            // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import-existing-stack.html
            terminationProtection: true
        });

        this.zone = new route53.PublicHostedZone(this, "giraffeScienceZone", {
            zoneName: props.domainName
        });
        gandiMail(this.zone);
        githubPages(this.zone);
        this.rootEdgeCertificate = new certs.DnsValidatedCertificate(this, "rootEdgeCertificate", {
            hostedZone: this.zone,
            domainName: `*.${this.zone.zoneName}`,
            validation: CertificateValidation.fromDns(this.zone),
            region:"us-east-1"// required for EDGE-deployed lambdas
        });
    }
}

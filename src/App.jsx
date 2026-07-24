import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import {
  Search, Plus, X, FileText, LogOut, Pencil, Check,
  LayoutGrid, Table as TableIcon, Building2, User, Trash2,
  AlertTriangle, Clock, CheckCircle2, XCircle, CircleDashed, Send, ShieldCheck, Users, ChevronDown, Download, Smartphone
} from "lucide-react";

// One-time seed data — used only the very first time the database has no
// practices at all, so the app isn't blank on first login. Safe to ignore
// or delete once you've added your own practices and data.
const SEED = {"practice":{"name":"DocDx.com","npi":"1770204638","taxId":"88-3333782"},"entries":[{"id":"p1","payor":"MD Medicaid","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-04-28","followUp":null,"phone":"","note":"pplication ID 264Q5ISG. The representative advised that it is currently in the final stage of review. No TAT provided 04/28/2026 Checked ePREP Portal, Revalidation Application under Application ID 264Q5ISG is still showing as under review 04/28/2026 Checked ePREP Portal, Revalida"},{"id":"p2","payor":"MD Medicaid","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-05-14","followUp":null,"phone":"","note":"05/11/2026 Reached out to ePREP Provider Services and SW Bob Ref # bob05112026. Rep states that the provider is currently showing in suspended status on their system as the revalidation app was returned and still not resubmitted 05/14/2026 SW Matt Ref # Matt05142026. Revalidation"},{"id":"p3","payor":"MD Medicaid","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-02","followUp":null,"phone":"","note":"and asks to kindly allow for more time. 06/01/2026. SW Bob Ref # Bob060122026. Per rep the application is still in process and currently under review. Rep advised t allow more time for completiion 06/02/2026 SW Marci Ref # MarciD06022026. Per rep the application to add the laurel"},{"id":"p4","payor":"Coventry HealthCare","providerName":"Gezzer Ortega, MD","status":"Denied","lastUpdate":"2026-06-08","followUp":null,"phone":"","note":"d and we are not accepting applications. Please check back on our website routinely to stay apprised of our panel status. We will update the site when our panels are open for new applicants. 06/08/2026 SW Victoria Ref 23563589 Called to check the status of the request to link the"},{"id":"p5","payor":"Coventry HealthCare","providerName":"Nancy Hartman, NP","status":"Denied","lastUpdate":"2026-04-15","followUp":null,"phone":"","note":"04/15/26 Called Coventry Health Care (800-937-6824) SW Victoria Ref # 23090218. Rep confirmed that the panel is closed for new applicant **** Closed Panel ****"},{"id":"p6","payor":"Aetna Better Health MD","providerName":"Gezzer Ortega, MD","status":"Approved","lastUpdate":"2026-06-08","followUp":null,"phone":"","note":"the status of the request to update the provider's status to \"Acccepting New Member\" Under Case Number : 346996099. Per rep the request was received on 05/29/2026 and currently in process. TAT 60-90 CD 06/08/2026 SW Annie Ref # DVGZR0002830108 . Per rep, the provider is INN and l"},{"id":"p7","payor":"Aetna Better Health MD","providerName":"Nancy Hartman, NP","status":"Approved","lastUpdate":"2026-06-08","followUp":null,"phone":"","note":"the status of the request to update the provider's status to \"Acccepting New Member\" Under Case Number : 346996099. Per rep the request was received on 05/29/2026 and currently in process. TAT 60-90 CD 06/08/2026 SW Annie Ref # DVGZR0002830108 . Per rep, the provider is INN and l"},{"id":"p8","payor":"Oscar","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-04-29","followUp":null,"phone":"","note":"stated that none are on file. Rep also advised that if we wanted the provider to be INN with Oscar, we should send an email to credentialing@hioscar.com or submit a request to join the network to their online portal www.hioscar.com/form/request-to-join 04/29/2026 Sent an email to"},{"id":"p9","payor":"Oscar","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-04-17","followUp":null,"phone":"","note":"s OON. I also inquired about any pending or existing provider applications, and the representative stated that none are on file. Rep also advised that if we wanted the group to be INN with Oscar, we should send an email to credentialing@hioscar.com or submit a request to join the"},{"id":"p10","payor":"Oscar","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-05-06","followUp":null,"phone":"","note":"m join_our_network@hioscar.com. Thank you for your interest in joining the Oscar Health Network. Based on the information provided in your submission, we are not able to accept your request at this time as we are not offering coverage in the MD area. We will keep your information"},{"id":"p11","payor":"Priority Partners","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-04-21","followUp":null,"phone":"","note":"continuously strive to maintain a balance between the size of our network and the volume of utilization to best serve our members. If you have any further questions or concerns, please feel free to contact the Provider Relations Department at the email below. Once again, thank yo"},{"id":"p12","payor":"Priority Partners","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-04-21","followUp":null,"phone":"","note":"continuously strive to maintain a balance between the size of our network and the volume of utilization to best serve our members. If you have any further questions or concerns, please feel free to contact the Provider Relations Department at the email below. Once again, thank yo"},{"id":"p13","payor":"Priority Partners","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-04-21","followUp":null,"phone":"","note":"continuously strive to maintain a balance between the size of our network and the volume of utilization to best serve our members. If you have any further questions or concerns, please feel free to contact the Provider Relations Department at the email below. Once again, thank yo"},{"id":"p14","payor":"Medstar","providerName":"Gezzer Ortega, MD","status":"Not Started","lastUpdate":"2026-07-16","followUp":null,"phone":"","note":"is still OON, his information has been loaded into their system. She advised to kindly allow for more time. 07/07/26 SW Nicole Ref # 01462963. As per the rep, the provider is still OON. 07/14/2026 SW Rose Ref # 01467805. Per rep, Dr. Ortega is still showing OON 07/16/2026 SW Ian "},{"id":"p15","payor":"Medstar","providerName":"Nancy Hartman, NP","status":"Approved","lastUpdate":"2026-06-23","followUp":null,"phone":"","note":"confirm if the information has been updated as per our requests. As per rep, the only information that has been updated is for the mailing address to be set to the Rockville address. 06/23/2026 Rec'd an email from mfc-providerrelations2@medstar.net. The fax number has been update"},{"id":"p16","payor":"Medstar","providerName":"DocDx.com (Group)","status":"Approved","lastUpdate":"2026-06-23","followUp":null,"phone":"","note":"confirm if the information has been updated as per our requests. As per rep, the only information that has been updated is for the mailing address to be set to the Rockville address. 06/23/2026 Rec'd an email from mfc-providerrelations2@medstar.net. The fax number has been update"},{"id":"p17","payor":"Wellpoint (MCO)","providerName":"Gezzer Ortega, MD","status":"Not Started","lastUpdate":"2026-07-13","followUp":null,"phone":"","note":"there is still no additional service locations for this provider and the only one on file is the Rockville address. 06/15/2026 SW Tearra Ref # ICC 1550191. Called to check if the laurel address was already reflection on their end. Per rep, the laurel address is still not showing "},{"id":"p18","payor":"Wellpoint (MCO)","providerName":"Nancy Hartman, NP","status":"Not Started","lastUpdate":"2026-07-13","followUp":null,"phone":"","note":"5/27/2026 SW Empress W. Ref # icc14800734. Reached out to see if the Laurel address is reflecting on their system for the provider. She states that as of right now, there is still no additional service locations for this provider and the only one on file is the Rockville address."},{"id":"p19","payor":"Wellpoint (MCO)","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-07-14","followUp":null,"phone":"","note":"once they've receive a response from wellpoint 07/09/2026 SW Heather Ref # 18660092. Per rep the case number is still pending 07/09/2026 SW Char Ref # 18660092. Per rep the case number is still pending 07/13/2026 SW Veronica Ref # 18660092. Per rep the case is still in process 07"},{"id":"p20","payor":"Cigna Commercial","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-05-29","followUp":null,"phone":"","note":"refd05282026. Rep states that as per checking, the provider does not have a recredentialing date nor a termination date showing on file, which he claims would mean that the PLI was received and the recredentialing process was completed. 05/29/2026 Received an email from mrtdocint"},{"id":"p21","payor":"Cigna Commercial","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-05-16","followUp":null,"phone":"","note":"r on file 05/14/2026 SW Jus Ref # Juss B05142026. Rep confirmed that the request to update the fax number on file has been received and is currently under review. The turnaround time is 20\u201330 calendar days. 05/15/2026 Daisy Ref # DaisyT05152026. Rep confirmed that the fax number "},{"id":"p22","payor":"Cigna Commercial","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-05-16","followUp":null,"phone":"","note":"r on file 05/14/2026 SW Jus Ref # Juss B05142026. Rep confirmed that the request to update the fax number on file has been received and is currently under review. The turnaround time is 20\u201330 calendar days. 05/15/2026 Daisy Ref # DaisyT05152026. Rep confirmed that the fax number "},{"id":"p23","payor":"Cigna HealthSpring","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-07-09","followUp":null,"phone":"","note":"ledge the email and inquired about the TAT 06/22/2026 Sent an email to maprovidercontracts@healthspring.com to follow up the contract for the group and providers 07/09/2026 Received an email from maprovidercontracts@healthspring.com stating that the contract could take up to 90-1"},{"id":"p24","payor":"Cigna HealthSpring","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-07-09","followUp":null,"phone":"","note":"ledge the email and inquired about the TAT 06/22/2026 Sent an email to maprovidercontracts@healthspring.com to follow up the contract for the group and providers 07/09/2026 Received an email from maprovidercontracts@healthspring.com stating that the contract could take up to 90-1"},{"id":"p25","payor":"Cigna HealthSpring","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-07-09","followUp":null,"phone":"","note":"contract for the group and providers 06/29/2026 SW Rica Ref # 17582546. Called to check the Network Par Status of the group, per rep the app is still in process 07/09/2026 Received an email from maprovidercontracts@healthspring.com stating that the contract could take up to 90-12"},{"id":"p26","payor":"CareFirst (Commercial)","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-06-29","followUp":null,"phone":"","note":"06/17/2026 Application to add the laurel location has been submitted. Case # 02144908 06/29/2026 checked the CareFirst Provider Self-Service Portal and the CareFirst Provider Directory, and the Laurel address is already listed."},{"id":"p27","payor":"CareFirst (Commercial)","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-29","followUp":null,"phone":"","note":"06/17/2026 Application to add the laurel location has been submitted. Case # 02144908 06/29/2026 checked the CareFirst Provider Self-Service Portal and the CareFirst Provider Directory, and the Laurel address is already listed."},{"id":"p28","payor":"CareFirst (Commercial)","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-29","followUp":null,"phone":"","note":"06/17/2026 Application to add the laurel location has been submitted. Case # 02144908 06/29/2026 checked the CareFirst Provider Self-Service Portal and the CareFirst Provider Directory, and the Laurel address is already listed."},{"id":"p29","payor":"CareFirst Community Health Plan (MCO)","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-06-22","followUp":null,"phone":"","note":"st.com 06/15/2026 Sent an email to Credentialingstatus@carefirst.com to check the status of the application. Awaiting for response 06/17/2026 Application for the CCHP has been submitted. Case # 02148702 06/22/2026 Sent an email to Credentialingstatus@carefirst.com to check the st"},{"id":"p30","payor":"CareFirst Community Health Plan (MCO)","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-22","followUp":null,"phone":"","note":"st.com 06/15/2026 Sent an email to Credentialingstatus@carefirst.com to check the status of the application. Awaiting for response 06/17/2026 Application for the CCHP has been submitted. Case # 02148702 06/22/2026 Sent an email to Credentialingstatus@carefirst.com to check the st"},{"id":"p31","payor":"CareFirst Community Health Plan (MCO)","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-22","followUp":null,"phone":"","note":"st.com 06/15/2026 Sent an email to Credentialingstatus@carefirst.com to check the status of the application. Awaiting for response 06/17/2026 Application for the CCHP has been submitted. Case # 02148702 06/22/2026 Sent an email to Credentialingstatus@carefirst.com to check the st"},{"id":"p32","payor":"Aetna","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-06-09","followUp":null,"phone":"","note":"addresses for both the group and the providers. 06/09/2026 SW Ana D Ref # 349886996. Rep Confimed that the Billing address was already Updated for the group and also for the providers. I also Inquired if the Laurel address was already showing for Dr. Ortega. Rep confirmed that th"},{"id":"p33","payor":"Aetna","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-09","followUp":null,"phone":"","note":"6/01/2026 SW Anj R Ref # 347436661. The rep confirmed that 8347 Cherry Ln, Laurel, MD 20707-4828 has already been added as the provider's service location. However, the billing address has still not been updated. 06/09/2026 SW Ana D Ref # 349886996. Rep Confimed that the Billing "},{"id":"p34","payor":"Aetna","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-09","followUp":null,"phone":"","note":"026. 06/01/2026 SW Anj R Ref # 347436661. Rep confirmed that 8347 Cherry Ln, Laurel, MD 20707-4828 has already been added as the group's service location. However, the billing address has still not been updated. 06/09/2026 SW Ana D Ref # 349886996. Rep Confimed that the Billing a"},{"id":"p35","payor":"Tricare East","providerName":"DocDx.com (Group)","status":"Not Started","lastUpdate":"2026-06-26","followUp":null,"phone":"","note":"rest in joining the TRICARE East Region network to provide care for our beneficiaries. At this time, we are not currently expanding our network based on your specialty and location within the East Region. Please understand that every market is different based on the beneficiary p"},{"id":"p36","payor":"Humana","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"Note: Recred Date: 08/24/2026"},{"id":"p37","payor":"Humana","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"no specific turnaround time for processing the request and recommended calling back to check the status. Reference number 2000526575915 can be used for future follow-up inquiries regarding the request. 06/03/2026 Ceddie B Ref # 2000526797969 . Per rep the Laurel adress has alread"},{"id":"p38","payor":"Humana","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"no specific turnaround time for processing the request and recommended calling back to check the status. Reference number 2000526575915 can be used for future follow-up inquiries regarding the request. 06/03/2026 Ceddie B Ref # 2000526797969 . Per rep the Laurel adress has alread"},{"id":"p39","payor":"Multiplan","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-07-17","followUp":null,"phone":"","note":"Per rep the application is still in process. TAT 90-100 days Rep Advised to allow more time 07/06/2026 SW Danielle Ref # 16337467. Per rep, the application is still in process 07/13/2026 SW Tamera C Ref # 16337467. Per rep, the application is still in process 07/17/2026 SW Luzi R"},{"id":"p40","payor":"Multiplan","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-15","followUp":null,"phone":"","note":"med that the provider is INN and linked with the group tax ID, effective 06/04/2026. Provider is INN with multiplan and HCPS. Provider ID: 14119550, Recred date: 03/04/2029 06/12/2026 Submitted a request to Update the fax and billing address on file 06/15/2026 SW Lucia Ref # 1606"},{"id":"p41","payor":"Multiplan","providerName":"DocDx.com (Group)","status":"Approved","lastUpdate":"2026-05-29","followUp":null,"phone":"","note":"16172967. Per rep, the fax number has already been updated for the group. 05/28/2026. SW Tracy Ref # Tracy052820261115. Called to follow up on the request to update the fax number on file. Rep confirmed that the fax number for the Rockville address has already been updated; howev"},{"id":"p42","payor":"Maryland Physician Care","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"the Laural address is still in process. 05/29/2026 Rec'd an email from providerdatamanagement@mpcmedicaid.com. The add location request has been submitted. Please allow from 15 business days for processing. 06/03/2026 SW Brianna Ref # 10858546ABCD.Rep confirmedthat the Laurel add"},{"id":"p43","payor":"Maryland Physician Care","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"e addition of the Laural address is still in process. 05/29/2026 Rec'd an email from providerdatamanagement@mpcmedicaid.com. The add location request has been submitted. Please allow from 15 business days for processing. 06/03/2026 SW Brianna Ref # 10858546ABCD. the Laurel addres"},{"id":"p44","payor":"Maryland Physician Care","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-06-03","followUp":null,"phone":"","note":"15 business days for processing. 06/01/2026 SW Elizabeth Ref # 10849535ABC. Called to verify whether the Laurel address is already showing in their system. Per the rep, the Laurel address is not yet visible on their end. 06/03/2026 SW Brianna Ref # 10858546ABCD. the Laurel addres"},{"id":"p45","payor":"Kaiser Permanente","providerName":"Gezzer Ortega, MD","status":"Denied","lastUpdate":"2026-06-15","followUp":null,"phone":"","note":"s. After a careful review of your application and our current network, we have determined we have a sufficient number of similarly qualified providers in the area. Therefore, we will not be pursuing a contract with your practice. You may appeal this decision by providing further "},{"id":"p46","payor":"Kaiser Permanente","providerName":"Nancy Hartman, NP","status":"Denied","lastUpdate":"2026-06-15","followUp":null,"phone":"","note":"s. After a careful review of your application and our current network, we have determined we have a sufficient number of similarly qualified providers in the area. Therefore, we will not be pursuing a contract with your practice. You may appeal this decision by providing further "},{"id":"p47","payor":"Kaiser Permanente","providerName":"DocDx.com (Group)","status":"Denied","lastUpdate":"2026-06-15","followUp":null,"phone":"","note":"s. After a careful review of your application and our current network, we have determined we have a sufficient number of similarly qualified providers in the area. Therefore, we will not be pursuing a contract with your practice. You may appeal this decision by providing further "},{"id":"p48","payor":"UHC","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-07-16","followUp":null,"phone":"","note":"to allow for more time as they still haven't received the necessary information that their national credentialing team is requesting from the provider's university. 7/16/2026 SW Jaypee Ref# 180758860. As per rep. the national credentialing team is waiting for the response of the "},{"id":"p49","payor":"UHC","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-09","followUp":null,"phone":"","note":"e My Practice Profile tool through the UHC Portal to update the providers' Fax # on file. 06/05/2026 Fax number has been updated through UHC Provider portal. Request number GL000005039356 06/09/2026 SW Luna Ref #174950754. Rep confirmed that the Laurel address and fax number has "},{"id":"p50","payor":"UHC","providerName":"DocDx.com (Group)","status":"Not Started","lastUpdate":"2026-06-09","followUp":null,"phone":"","note":"06/05/2026 Fax number has been updated through UHC Provider portal. Request number GL000005039356 06/09/2026 SW Luna Ref #174950754. Rep confirmed that the Laurel address and fax number has been added to the provider's information on their system eff 6/5/26."},{"id":"p51","payor":"Jai Medical System","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-05-22","followUp":null,"phone":"","note":"a bit repetitive, yet rest assure all the information is needed, for when we proceed forward with contract drafts and approvals. We will resort back to the application information when necessary to properly input the provider and the organization into the database. -Provider and "},{"id":"p52","payor":"Jai Medical System","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-05-22","followUp":null,"phone":"","note":"a bit repetitive, yet rest assure all the information is needed, for when we proceed forward with contract drafts and approvals. We will resort back to the application information when necessary to properly input the provider and the organization into the database. -Provider and "},{"id":"p53","payor":"Jai Medical System","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-05-22","followUp":null,"phone":"","note":"a bit repetitive, yet rest assure all the information is needed, for when we proceed forward with contract drafts and approvals. We will resort back to the application information when necessary to properly input the provider and the organization into the database. -Provider and "},{"id":"p54","payor":"Firsthealth","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-07-16","followUp":null,"phone":"","note":"e allow up to 45 bd for the completion of this request. 07/14/2026 SW Rae Ref # 2214168. Per rep, the fax number is still not updated. 07/16/2026 SW RAe Ref# 2219159. As per rep, fax number still not updated in the system and was advised to verify with Aetna if the request was re"},{"id":"p55","payor":"Firsthealth","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-06-29","followUp":null,"phone":"","note":"o 301-301-1875 to pdsdallas@aetna.com 06/29/2026 SW Teresa Ref # 2190256. Called to see if our request to update the fax number on file is in process. Rep states that the fax number still hasn't been updated, and while she wasn't able to confirm if this is in process or not, she "},{"id":"p56","payor":"Curative","providerName":"Gezzer Ortega, MD","status":"In Review","lastUpdate":"2026-05-26","followUp":null,"phone":"","note":"5/11/26 Submitted the online interest form, TAT is 7 - 10 bd for a response. Will be following-up week on 5/26/26 if no response prior."},{"id":"p57","payor":"Curative","providerName":"Nancy Hartman, NP","status":"In Review","lastUpdate":"2026-05-26","followUp":null,"phone":"","note":"5/11/26 Submitted the online interest form, TAT is 7 - 10 bd for a response. Will be following-up week on 5/26/26 if no response prior."},{"id":"p58","payor":"Curative","providerName":"DocDx.com (Group)","status":"In Review","lastUpdate":"2026-05-26","followUp":null,"phone":"","note":"5/11/26 Submitted the online interest form, TAT is 7 - 10 bd for a response. Will be following-up week on 5/26/26 if no response prior."},{"id":"p59","payor":"EyeMed","providerName":"Gezzer Ortega, MD","status":"Denied","lastUpdate":"2026-06-05","followUp":null,"phone":"","note":"5/18/26 SW Cheryl Ref # cheryl05182026. She states that the request to join the network was denied as they are only accepting vision providers."},{"id":"p60","payor":"EyeMed","providerName":"DocDx.com (Group)","status":"Denied","lastUpdate":"2026-06-05","followUp":null,"phone":"","note":"5/18/26 SW Cheryl Ref # cheryl05182026. She states that the request to join the network was denied as they are only accepting vision providers."},{"id":"p61","payor":"Vitori Health","providerName":"Gezzer Ortega, MD","status":"Denied","lastUpdate":"2026-06-05","followUp":null,"phone":"","note":"5/18/26 SW Cheryl Ref # cheryl05182026. She states that the request to join the network was denied as they are only accepting vision providers."},{"id":"p62","payor":"Vitori Health","providerName":"Nancy Hartman, NP","status":"Not Started","lastUpdate":"2026-05-18","followUp":null,"phone":"","note":"05/18/2026 No credentialing required; the start date will also serve as the effective date."},{"id":"p63","payor":"Vitori Health","providerName":"DocDx.com (Group)","status":"Not Started","lastUpdate":"2026-05-18","followUp":null,"phone":"","note":"05/18/2026 No credentialing required; the start date will also serve as the effective date."}],"documents":[{"id":"d1","name":"PLI","providerName":"Gezzer Ortega, MD","expiration":"2027-01-27"},{"id":"d2","name":"PLI","providerName":"Nancy Hartman, NP","expiration":"2027-01-28"},{"id":"d3","name":"DEA","providerName":"Gezzer Ortega, MD","expiration":"2026-12-31"},{"id":"d4","name":"DEA","providerName":"Nancy Hartman, NP","expiration":"2027-10-31"},{"id":"d5","name":"CDS","providerName":"Gezzer Ortega, MD","expiration":"2029-05-31"},{"id":"d6","name":"CDS","providerName":"Nancy Hartman, NP","expiration":"2027-12-31"},{"id":"d7","name":"State License","providerName":"Gezzer Ortega, MD","expiration":"2027-09-30"},{"id":"d8","name":"State License","providerName":"Nancy Hartman, NP","expiration":"2027-09-28"},{"id":"d9","name":"Board Certification","providerName":"Nancy Hartman, NP","expiration":"2027-04-04"}]};

const STAGES = ["Not Started", "Submitted", "In Review", "Approved", "Denied"];

const STAGE_META = {
  "Not Started":  { color: "#7C879B", bg: "#EEF0F3", icon: CircleDashed, label: "NOT STARTED" },
  "Submitted":    { color: "#C98A2B", bg: "#FBF0DE", icon: Send,          label: "SUBMITTED" },
  "In Review":    { color: "#2F6F6B", bg: "#E4EEED", icon: Clock,         label: "IN REVIEW" },
  "Approved":     { color: "#4C7A52", bg: "#E9F1E9", icon: CheckCircle2,  label: "APPROVED / ACTIVE" },
  "Denied":       { color: "#B0492E", bg: "#F7E7E1", icon: XCircle,       label: "DENIED / CLOSED" },
};

const TAB_COLORS = ["#C99A44", "#2F6F6B", "#7A5C9E", "#B0492E", "#3B6FA0", "#4C7A52"];
function providerColor(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TAB_COLORS[h % TAB_COLORS.length];
}

function fmtDate(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "\u2014";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
}

function rowToEntry(r) {
  return { id: r.id, practiceId: r.practice_id, payor: r.payor, providerName: r.provider_name, status: r.status, lastUpdate: r.last_update, followUp: r.follow_up, phone: r.phone || "", note: r.note || "" };
}
function rowToDoc(r) {
  return { id: r.id, practiceId: r.practice_id, name: r.name, providerName: r.provider_name, expiration: r.expiration };
}
function rowToPractice(r) {
  return { id: r.id, name: r.name, npi: r.npi, taxId: r.tax_id };
}

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setProfile(null); return; }
    supabase.from("profiles").select("*").eq("id", session.user.id).single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  if (session === undefined) return <FullScreenMessage text="Loading\u2026" />;
  if (!session) return <AuthScreen />;
  if (!profile) return <FullScreenMessage text="Setting up your account\u2026" />;

  return <Tracker session={session} profile={profile} />;
}

function FullScreenMessage({ text }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFF1EC", fontFamily: "'IBM Plex Sans', sans-serif", color: "#16302E" }}>
      <FontImports />
      {text}
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#16302E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans', sans-serif", padding: 20 }}>
      <FontImports />
      <div style={{ width: "min(380px, 100%)", background: "#fff", borderRadius: 14, padding: 28 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: 2, color: "#C99A44", marginBottom: 6 }}>MULTI-PRACTICE</div>
        <h1 className="display" style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 600, color: "#16302E" }}>Credentialing Tracker</h1>
        <p style={{ fontSize: 13, color: "#6B7570", margin: "0 0 20px" }}>
          {mode === "signin" ? "Sign in to your team's tracker." : "Create an account to join the tracker."}
        </p>
        <form onSubmit={submit}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>EMAIL</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: 6, marginBottom: 14, padding: "9px 11px", border: "1px solid #E2DFD2", borderRadius: 7, fontSize: 14 }} />
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>PASSWORD</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginTop: 6, marginBottom: 18, padding: "9px 11px", border: "1px solid #E2DFD2", borderRadius: 7, fontSize: 14 }} />
          {error && <div style={{ background: "#F7E7E1", color: "#B0492E", padding: "8px 10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
          {info && <div style={{ background: "#E9F1E9", color: "#4C7A52", padding: "8px 10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>{info}</div>}
          <button type="submit" disabled={busy} style={{ width: "100%", padding: "11px", background: "#2F6F6B", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
            {busy ? "Please wait\u2026" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setInfo(""); }}
          style={{ marginTop: 16, background: "none", border: "none", color: "#2F6F6B", fontSize: 12.5, padding: 0 }}>
          {mode === "signin" ? "New to the team? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

function Tracker({ session, profile }) {
  const isAdmin = profile.role === "admin";
  const [appSettings, setAppSettings] = useState({ app_name: "Credentialing Tracker" });
  const [practices, setPractices] = useState([]);
  const [activePracticeId, setActivePracticeId] = useState(() => localStorage.getItem("active-practice-id") || null);
  const [entries, setEntries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board");
  const [tab, setTab] = useState("tracker");
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [active, setActive] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddPractice, setShowAddPractice] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); }, []);

  const seedIfEmpty = useCallback(async (existingPractices) => {
    if (existingPractices.length > 0) return existingPractices;
    const { data: practice, error } = await supabase.from("practices").insert({
      name: SEED.practice.name, npi: SEED.practice.npi, tax_id: SEED.practice.taxId, created_by: session.user.id,
    }).select().single();
    if (error || !practice) return existingPractices;
    const entryRows = SEED.entries.map(({ id, ...rest }) => ({
      practice_id: practice.id, payor: rest.payor, provider_name: rest.providerName, status: rest.status,
      last_update: rest.lastUpdate, follow_up: rest.followUp, phone: rest.phone, note: rest.note, created_by: session.user.id,
    }));
    const docRows = SEED.documents.map(({ id, ...rest }) => ({
      practice_id: practice.id, name: rest.name, provider_name: rest.providerName, expiration: rest.expiration, created_by: session.user.id,
    }));
    if (entryRows.length) await supabase.from("entries").insert(entryRows);
    if (docRows.length) await supabase.from("documents").insert(docRows);
    return [practice];
  }, [session.user.id]);

  const loadPractices = useCallback(async () => {
    const { data, error } = await supabase.from("practices").select("*").order("name", { ascending: true });
    if (error) { showToast("Couldn't load practices: " + error.message); return; }
    let list = data || [];
    if (list.length === 0) list = await seedIfEmpty(list);
    const mapped = list.map(rowToPractice);
    setPractices(mapped);
    setActivePracticeId((prev) => {
      if (prev && mapped.some((p) => p.id === prev)) return prev;
      return mapped[0]?.id || null;
    });
  }, [seedIfEmpty, showToast]);

  const loadAppSettings = useCallback(async () => {
    const { data } = await supabase.from("app_settings").select("*").eq("id", 1).single();
    if (data) setAppSettings(data);
  }, []);

  const loadWorkspace = useCallback(async (practiceId) => {
    if (!practiceId) { setEntries([]); setDocuments([]); setLoading(false); return; }
    const [{ data: e, error: e1 }, { data: d, error: e2 }] = await Promise.all([
      supabase.from("entries").select("*").eq("practice_id", practiceId).order("payor", { ascending: true }),
      supabase.from("documents").select("*").eq("practice_id", practiceId).order("expiration", { ascending: true }),
    ]);
    if (e1) showToast("Couldn't load applications: " + e1.message);
    if (e2) showToast("Couldn't load documents: " + e2.message);
    setEntries((e || []).map(rowToEntry));
    setDocuments((d || []).map(rowToDoc));
    setLoading(false);
  }, [showToast]);

  useEffect(() => { loadAppSettings(); loadPractices(); }, [loadAppSettings, loadPractices]);
  useEffect(() => { if (activePracticeId) localStorage.setItem("active-practice-id", activePracticeId); }, [activePracticeId]);
  useEffect(() => { setLoading(true); loadWorkspace(activePracticeId); }, [activePracticeId, loadWorkspace]);

  useEffect(() => {
    const channel = supabase
      .channel("tracker-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, () => loadWorkspace(activePracticeId))
      .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, () => loadWorkspace(activePracticeId))
      .on("postgres_changes", { event: "*", schema: "public", table: "practices" }, loadPractices)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, loadAppSettings)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activePracticeId, loadWorkspace, loadPractices, loadAppSettings]);

  const activePractice = practices.find((p) => p.id === activePracticeId) || null;

  const providerNames = useMemo(() => {
    const set = new Set(entries.map((e) => e.providerName).filter(Boolean));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => entries.filter((e) => {
    if (providerFilter !== "All" && e.providerName !== providerFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!e.payor.toLowerCase().includes(q) && !(e.note || "").toLowerCase().includes(q)) return false;
    }
    return true;
  }), [entries, query, providerFilter]);

  const counts = useMemo(() => {
    const c = {}; STAGES.forEach((s) => (c[s] = 0));
    entries.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; });
    return c;
  }, [entries]);

  const needsFollowUp = useMemo(() => entries.filter((e) => {
    const d = daysUntil(e.followUp);
    return d !== null && d <= 3;
  }).length, [entries]);

  async function updateEntry(id, patch) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    if (active && active.id === id) setActive({ ...active, ...patch });
    const dbPatch = {};
    if ("status" in patch) dbPatch.status = patch.status;
    if ("lastUpdate" in patch) dbPatch.last_update = patch.lastUpdate;
    if ("followUp" in patch) dbPatch.follow_up = patch.followUp;
    if ("phone" in patch) dbPatch.phone = patch.phone;
    if ("note" in patch) dbPatch.note = patch.note;
    if ("providerName" in patch) dbPatch.provider_name = patch.providerName;
    const { error } = await supabase.from("entries").update(dbPatch).eq("id", id);
    if (error) showToast("Save failed: " + error.message);
  }

  function addNote(id, text) {
    if (!text.trim()) return;
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const stamp = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const merged = (stamp + " \u2014 " + profile.email + ": " + text.trim() + (entry.note ? ("\n\n" + entry.note) : "")).slice(0, 6000);
    updateEntry(id, { note: merged, lastUpdate: new Date().toISOString().slice(0, 10) });
  }

  async function deleteEntry(id) {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (error) { showToast("Delete failed: " + error.message); return; }
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setActive(null);
    showToast("Application removed");
  }

  async function addEntry(payload) {
    const { data, error } = await supabase.from("entries").insert({
      practice_id: activePracticeId, payor: payload.payor, provider_name: payload.providerName, status: payload.status, created_by: session.user.id,
    }).select().single();
    if (error) { showToast("Couldn't add: " + error.message); return; }
    setEntries((prev) => [rowToEntry(data), ...prev]);
    setShowAdd(false);
    showToast("Application added");
  }

  async function addDocument(doc) {
    const { data, error } = await supabase.from("documents").insert({
      practice_id: activePracticeId, name: doc.name, provider_name: doc.providerName, expiration: doc.expiration, created_by: session.user.id,
    }).select().single();
    if (error) { showToast("Couldn't add: " + error.message); return; }
    setDocuments((prev) => [rowToDoc(data), ...prev]);
  }

  async function deleteDocument(id) {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) { showToast("Delete failed: " + error.message); return; }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  async function addPractice(payload) {
    const { data, error } = await supabase.from("practices").insert({
      name: payload.name, npi: payload.npi || null, tax_id: payload.taxId || null, created_by: session.user.id,
    }).select().single();
    if (error) { showToast("Couldn't add practice: " + error.message); return; }
    const p = rowToPractice(data);
    setPractices((prev) => [...prev, p].sort((a, b) => a.name.localeCompare(b.name)));
    setActivePracticeId(p.id);
    setShowAddPractice(false);
    showToast("Practice group added");
  }

  async function renameAppName(newName) {
    if (!isAdmin || !newName.trim()) return;
    const { error } = await supabase.from("app_settings").update({ app_name: newName.trim() }).eq("id", 1);
    if (error) { showToast("Couldn't rename: " + error.message); return; }
    setAppSettings((s) => ({ ...s, app_name: newName.trim() }));
    showToast("Tracker name updated");
  }

  if (loading && practices.length === 0) return <FullScreenMessage text="Loading tracker\u2026" />;

  return (
    <div style={{ minHeight: "100vh", background: "#EFF1EC", fontFamily: "'IBM Plex Sans', sans-serif", color: "#16302E" }}>
      <FontImports />
      <InstallBanner />
      <Header
        appName={appSettings.app_name} isAdmin={isAdmin} onRename={renameAppName}
        counts={counts} total={entries.length} needsFollowUp={needsFollowUp} profile={profile}
        practices={practices} activePractice={activePractice} setActivePracticeId={setActivePracticeId}
        onAddPractice={() => setShowAddPractice(true)}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 64px" }}>
        <Tabs tab={tab} setTab={setTab} />

        {tab === "tracker" && (
          <>
            <Toolbar query={query} setQuery={setQuery} providerFilter={providerFilter} setProviderFilter={setProviderFilter}
              providerNames={providerNames} view={view} setView={setView} onAdd={() => setShowAdd(true)} />
            {view === "board"
              ? <Board entries={filtered} onOpen={setActive} />
              : <TableView entries={filtered} onOpen={setActive} />}
          </>
        )}

        {tab === "documents" && (
          <DocumentsPanel documents={documents} providerNames={providerNames} onAdd={addDocument} onDelete={deleteDocument} isAdmin={isAdmin} />
        )}

        {tab === "team" && <TeamPanel isAdmin={isAdmin} />}
      </div>

      {active && (
        <DetailDrawer entry={active} isAdmin={isAdmin} onClose={() => setActive(null)}
          onUpdate={updateEntry} onAddNote={addNote} onDelete={deleteEntry} />
      )}

      {showAdd && <AddModal providerNames={providerNames} practiceName={activePractice?.name} onClose={() => setShowAdd(false)} onSave={addEntry} />}
      {showAddPractice && <AddPracticeModal onClose={() => setShowAddPractice(false)} onSave={addPractice} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function FontImports() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      ::selection { background: #C99A44; color: #16302E; }
      .mono { font-family: 'IBM Plex Mono', monospace; }
      .display { font-family: 'Fraunces', serif; }
      button { font-family: inherit; cursor: pointer; }
      input, textarea, select { font-family: inherit; }
      textarea:focus, input:focus, select:focus { outline: 2px solid #2F6F6B; outline-offset: 1px; }
      button:focus-visible { outline: 2px solid #2F6F6B; outline-offset: 2px; }
      .card-hover { transition: transform 0.15s ease, box-shadow 0.15s ease; }
      .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,48,46,0.12); }
      @media (prefers-reduced-motion: reduce) { .card-hover { transition: none; } .card-hover:hover { transform: none; } }
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-thumb { background: #C7CCC3; border-radius: 6px; }
    `}</style>
  );
}

function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = window.navigator.standalone === true;
    if (standalone || iosStandalone) setInstalled(true);

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onInstalled() { setInstalled(true); setDeferredPrompt(null); }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return { deferredPrompt, installed, clearPrompt: () => setDeferredPrompt(null) };
}

function isIOS() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;
}

function InstallBanner() {
  const { deferredPrompt, installed, clearPrompt } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("install-banner-dismissed") === "1");
  const ios = isIOS();

  if (installed || dismissed) return null;
  if (!deferredPrompt && !ios) return null; // desktop browser that doesn't support install (e.g. Firefox) — stay quiet

  function dismiss() {
    localStorage.setItem("install-banner-dismissed", "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    clearPrompt();
  }

  return (
    <div style={{ background: "#C99A44", color: "#16302E", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", fontSize: 13 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {ios ? <Smartphone size={15} /> : <Download size={15} />}
        {ios
          ? <span>Install this app: tap <strong>Share</strong> in Safari, then <strong>Add to Home Screen</strong>.</span>
          : <span>Install this tracker as an app on this device for quick, full-screen access.</span>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {!ios && (
          <button onClick={install} style={{ background: "#16302E", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, fontWeight: 700, fontSize: 12.5 }}>
            Install
          </button>
        )}
        <button onClick={dismiss} style={{ background: "none", border: "1px solid rgba(22,48,46,0.3)", padding: "5px 10px", borderRadius: 6, fontSize: 12.5 }}>
          Not now
        </button>
      </div>
    </div>
  );
}

function Header({ appName, isAdmin, onRename, counts, total, needsFollowUp, profile, practices, activePractice, setActivePracticeId, onAddPractice }) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(appName);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => { setNameDraft(appName); }, [appName]);

  return (
    <div style={{ background: "#16302E", color: "#F3F1E9", padding: "24px 24px 20px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <button onClick={() => setSwitcherOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 12px 5px 10px", color: "#F3F1E9" }}>
                <Building2 size={12} color="#C99A44" />
                <span className="mono" style={{ fontSize: 11.5 }}>{activePractice ? activePractice.name : "No practice yet"}</span>
                <ChevronDown size={13} />
              </button>
              {switcherOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", minWidth: 220, zIndex: 40, overflow: "hidden" }}>
                  {practices.map((p) => (
                    <button key={p.id} onClick={() => { setActivePracticeId(p.id); setSwitcherOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", background: activePractice?.id === p.id ? "#F3F1E9" : "#fff", border: "none", color: "#16302E", fontSize: 13, fontWeight: activePractice?.id === p.id ? 700 : 500 }}>
                      {p.name}
                    </button>
                  ))}
                  <button onClick={() => { setSwitcherOpen(false); onAddPractice(); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left", padding: "9px 14px", background: "#F7F6F0", border: "none", borderTop: "1px solid #EEEBE0", color: "#2F6F6B", fontSize: 13, fontWeight: 700 }}>
                    <Plus size={14} /> New practice group
                  </button>
                </div>
              )}
            </div>
            {editingName ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus
                  className="display" style={{ fontSize: 26, fontWeight: 600, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, color: "#fff", padding: "2px 8px" }} />
                <button onClick={() => { onRename(nameDraft); setEditingName(false); }} style={{ background: "#C99A44", border: "none", borderRadius: 6, padding: 6, display: "flex" }}><Check size={16} color="#16302E" /></button>
                <button onClick={() => { setNameDraft(appName); setEditingName(false); }} style={{ background: "none", border: "none", color: "#D8D5C8", display: "flex" }}><X size={16} /></button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h1 className="display" style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{appName}</h1>
                {isAdmin && (
                  <button onClick={() => setEditingName(true)} title="Rename tracker (admin only)" style={{ background: "none", border: "none", color: "#9BA79E", display: "flex" }}>
                    <Pencil size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {needsFollowUp > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,154,68,0.16)", border: "1px solid rgba(201,154,68,0.4)", padding: "8px 14px", borderRadius: 8 }}>
                <AlertTriangle size={16} color="#C99A44" />
                <span style={{ fontSize: 13 }}>{needsFollowUp} follow-up{needsFollowUp !== 1 ? "s" : ""} due within 3 days</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: 8 }}>
              {isAdmin && <ShieldCheck size={14} color="#C99A44" />}
              <span className="mono" style={{ fontSize: 12 }}>{profile.email}</span>
              <button onClick={() => supabase.auth.signOut()} title="Sign out" style={{ background: "none", border: "none", color: "#D8D5C8", display: "flex" }}>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          {STAGES.map((s) => {
            const meta = STAGE_META[s]; const Icon = meta.icon;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: 8, borderBottom: "2px solid " + meta.color }}>
                <Icon size={14} color={meta.color} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: 0.5, color: "#D8D5C8" }}>{meta.label}</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{counts[s] || 0}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
            <span className="mono" style={{ fontSize: 11, color: "#9BA79E" }}>TOTAL {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tabs({ tab, setTab }) {
  const items = [
    { id: "tracker", label: "Payor Applications" },
    { id: "documents", label: "Provider Documents" },
    { id: "team", label: "Team" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 20, borderBottom: "2px solid #D9D5C8" }}>
      {items.map((it) => (
        <button key={it.id} onClick={() => setTab(it.id)}
          style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: tab === it.id ? "2px solid #16302E" : "2px solid transparent", marginBottom: -2, fontWeight: tab === it.id ? 700 : 500, color: tab === it.id ? "#16302E" : "#6B7570", fontSize: 14 }}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Toolbar({ query, setQuery, providerFilter, setProviderFilter, providerNames, view, setView, onAdd }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "20px 0" }}>
      <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
        <Search size={16} color="#7C877D" style={{ position: "absolute", left: 12, top: 11 }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search payor or notes\u2026"
          style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: "1px solid #D3D0C4", background: "#fff", fontSize: 14 }} />
      </div>
      <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}
        style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #D3D0C4", background: "#fff", fontSize: 14 }}>
        <option value="All">All providers</option>
        {providerNames.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <div style={{ display: "flex", border: "1px solid #D3D0C4", borderRadius: 8, overflow: "hidden" }}>
        <button onClick={() => setView("board")} style={{ padding: "9px 12px", background: view === "board" ? "#16302E" : "#fff", color: view === "board" ? "#fff" : "#16302E", border: "none", display: "flex", alignItems: "center", gap: 6 }}><LayoutGrid size={15} /> Board</button>
        <button onClick={() => setView("table")} style={{ padding: "9px 12px", background: view === "table" ? "#16302E" : "#fff", color: view === "table" ? "#fff" : "#16302E", border: "none", display: "flex", alignItems: "center", gap: 6 }}><TableIcon size={15} /> Table</button>
      </div>
      <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2F6F6B", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
        <Plus size={16} /> Add application
      </button>
    </div>
  );
}

function ProviderTag({ name }) {
  const color = providerColor(name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }} className="mono">
      <User size={12} color={color} />
      <span style={{ color: "#5B6560" }}>{name}</span>
    </div>
  );
}

function Board({ entries, onOpen }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(220px, 1fr))", gap: 14, overflowX: "auto", paddingBottom: 12 }}>
      {STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const items = entries.filter((e) => e.status === stage);
        return (
          <div key={stage} style={{ minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 10px", borderBottom: "2px solid " + meta.color }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: 1, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
              <span className="mono" style={{ fontSize: 11, color: "#8B948E" }}>{items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10, minHeight: 40 }}>
              {items.length === 0 && <div style={{ fontSize: 12, color: "#A6AEA5", padding: "10px 4px", fontStyle: "italic" }}>No applications</div>}
              {items.map((e) => <PayorCard key={e.id} entry={e} onOpen={onOpen} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PayorCard({ entry, onOpen }) {
  const color = providerColor(entry.providerName);
  const d = daysUntil(entry.followUp);
  const overdue = d !== null && d < 0;
  const soon = d !== null && d >= 0 && d <= 3;
  return (
    <div onClick={() => onOpen(entry)} className="card-hover"
      style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", cursor: "pointer", borderLeft: "4px solid " + color, boxShadow: "0 1px 2px rgba(22,48,46,0.06)" }}>
      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4, color: "#16302E" }}>{entry.payor}</div>
      <ProviderTag name={entry.providerName} />
      {entry.note && (
        <div style={{ fontSize: 12, color: "#6B7570", marginTop: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{entry.note}</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <span className="mono" style={{ fontSize: 10.5, color: "#9BA79E" }}>{fmtDate(entry.lastUpdate)}</span>
        {entry.followUp && (
          <span className="mono" style={{ fontSize: 10.5, color: overdue ? "#B0492E" : soon ? "#C98A2B" : "#9BA79E", fontWeight: overdue || soon ? 700 : 400 }}>FU {fmtDate(entry.followUp)}</span>
        )}
      </div>
    </div>
  );
}

function TableView({ entries, onOpen }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 2px rgba(22,48,46,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F3F1E9", textAlign: "left" }}>
            {["Payor", "Provider / Group", "Status", "Last Update", "Follow-up", "Note"].map((h) => (
              <th key={h} className="mono" style={{ padding: "10px 14px", fontSize: 10.5, letterSpacing: 0.6, color: "#6B7570", fontWeight: 700, borderBottom: "1px solid #E2DFD2" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const meta = STAGE_META[e.status];
            return (
              <tr key={e.id} onClick={() => onOpen(e)} style={{ cursor: "pointer", borderBottom: "1px solid #EEEBE0" }}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = "#FAF9F4")}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{e.payor}</td>
                <td style={{ padding: "10px 14px" }}><ProviderTag name={e.providerName} /></td>
                <td style={{ padding: "10px 14px" }}><span style={{ background: meta.bg, color: meta.color, padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{e.status}</span></td>
                <td className="mono" style={{ padding: "10px 14px", fontSize: 12, color: "#6B7570" }}>{fmtDate(e.lastUpdate)}</td>
                <td className="mono" style={{ padding: "10px 14px", fontSize: 12, color: "#6B7570" }}>{fmtDate(e.followUp)}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#6B7570", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.note}</td>
              </tr>
            );
          })}
          {entries.length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#9BA79E" }}>No applications match your filters.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function DetailDrawer({ entry, isAdmin, onClose, onUpdate, onAddNote, onDelete }) {
  const [noteText, setNoteText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(22,48,46,0.35)", display: "flex", justifyContent: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div style={{ width: "min(480px, 100%)", background: "#fff", height: "100%", overflowY: "auto", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <ProviderTag name={entry.providerName} />
            <h2 className="display" style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 600 }}>{entry.payor}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ marginTop: 18 }}>
          <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>PROVIDER / GROUP</label>
          <input value={entry.providerName} onChange={(e) => onUpdate(entry.id, { providerName: e.target.value })}
            style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>

        <div style={{ marginTop: 18 }}>
          <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>WORKFLOW STAGE</label>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {STAGES.map((s) => {
              const m = STAGE_META[s]; const isActive = entry.status === s;
              return (
                <button key={s} onClick={() => onUpdate(entry.id, { status: s })}
                  style={{ padding: "6px 11px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: "1px solid " + (isActive ? m.color : "#E2DFD2"), background: isActive ? m.color : "#fff", color: isActive ? "#fff" : "#6B7570" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
          <FieldDate label="Submitted / Last update" value={entry.lastUpdate} onChange={(v) => onUpdate(entry.id, { lastUpdate: v })} />
          <FieldDate label="Follow-up date" value={entry.followUp} onChange={(v) => onUpdate(entry.id, { followUp: v })} />
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>PAYOR PHONE</label>
          <input value={entry.phone || ""} onChange={(e) => onUpdate(entry.id, { phone: e.target.value })} placeholder="e.g. 800-000-0000"
            style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>

        <div style={{ marginTop: 20 }}>
          <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>ADD UPDATE / NOTE</label>
          <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3}
            placeholder="What happened? e.g. Called payor, application still in review\u2026"
            style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13, resize: "vertical" }} />
          <button onClick={() => { onAddNote(entry.id, noteText); setNoteText(""); }} disabled={!noteText.trim()}
            style={{ marginTop: 8, padding: "7px 14px", background: noteText.trim() ? "#2F6F6B" : "#D3D0C4", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 12.5 }}>
            Log update
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>HISTORY</label>
          <div style={{ marginTop: 8, background: "#F7F6F0", borderRadius: 8, padding: "12px 14px", fontSize: 12.5, color: "#4B534E", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 260, overflowY: "auto" }}>
            {entry.note || "No notes yet."}
          </div>
        </div>

        <div style={{ marginTop: 24, borderTop: "1px solid #EEEBE0", paddingTop: 16 }}>
          {!isAdmin ? (
            <div style={{ fontSize: 11.5, color: "#9BA79E" }}>Only admins can remove applications.</div>
          ) : !confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#B0492E", fontSize: 12.5, padding: 0 }}>
              <Trash2 size={14} /> Remove this application
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12.5, color: "#B0492E" }}>Remove permanently?</span>
              <button onClick={() => onDelete(entry.id)} style={{ background: "#B0492E", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 12 }}>Yes, remove</button>
              <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: "1px solid #D3D0C4", padding: "5px 12px", borderRadius: 6, fontSize: 12 }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldDate({ label, value, onChange }) {
  return (
    <div>
      <label className="mono" style={{ fontSize: 10.5, letterSpacing: 0.6, color: "#8B948E" }}>{label.toUpperCase()}</label>
      <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value || null)}
        style={{ width: "100%", marginTop: 6, padding: "7px 9px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
    </div>
  );
}

function AddModal({ onClose, onSave, providerNames, practiceName }) {
  const [payor, setPayor] = useState("");
  const [providerName, setProviderName] = useState(practiceName ? practiceName + " (Group)" : "Group");
  const [status, setStatus] = useState("Not Started");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(22,48,46,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div style={{ width: "min(420px, 92vw)", background: "#fff", borderRadius: 12, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="display" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>New application</h3>
          <button onClick={onClose} style={{ background: "none", border: "none" }}><X size={18} /></button>
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>PAYOR NAME</label>
          <input value={payor} onChange={(e) => setPayor(e.target.value)} placeholder="e.g. Anthem BCBS" style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>PROVIDER / GROUP</label>
          <input value={providerName} onChange={(e) => setProviderName(e.target.value)} list="provider-suggestions" placeholder="e.g. Jane Doe, MD"
            style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
          <datalist id="provider-suggestions">
            {providerNames.map((n) => <option key={n} value={n} />)}
          </datalist>
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>STARTING STAGE</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }}>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => payor.trim() && onSave({ payor: payor.trim(), providerName: providerName.trim() || "Group", status })} disabled={!payor.trim()}
          style={{ marginTop: 20, width: "100%", padding: "10px", background: payor.trim() ? "#2F6F6B" : "#D3D0C4", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
          Add application
        </button>
      </div>
    </div>
  );
}

function AddPracticeModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [npi, setNpi] = useState("");
  const [taxId, setTaxId] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(22,48,46,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div style={{ width: "min(420px, 92vw)", background: "#fff", borderRadius: 12, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="display" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>New practice group</h3>
          <button onClick={onClose} style={{ background: "none", border: "none" }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: "#6B7570", marginTop: 6 }}>Add a new client. You'll be switched to it right away with its own applications and documents.</p>
        <div style={{ marginTop: 12 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>PRACTICE / CLIENT NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Riverside Family Medicine" style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>GROUP NPI (optional)</label>
          <input value={npi} onChange={(e) => setNpi(e.target.value)} style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>TAX ID (optional)</label>
          <input value={taxId} onChange={(e) => setTaxId(e.target.value)} style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <button onClick={() => name.trim() && onSave({ name: name.trim(), npi: npi.trim(), taxId: taxId.trim() })} disabled={!name.trim()}
          style={{ marginTop: 20, width: "100%", padding: "10px", background: name.trim() ? "#2F6F6B" : "#D3D0C4", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
          Add practice group
        </button>
      </div>
    </div>
  );
}

function DocumentsPanel({ documents, providerNames, onAdd, onDelete, isAdmin }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "#6B7570", margin: 0 }}>Licenses and documents backing each provider's credentialing file for this practice. Expirations within 90 days are flagged.</p>
        <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#2F6F6B", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
          <Plus size={15} /> Add document
        </button>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 2px rgba(22,48,46,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F3F1E9", textAlign: "left" }}>
              {["Document", "Provider", "Expiration", "Status", ""].map((h) => (
                <th key={h} className="mono" style={{ padding: "10px 14px", fontSize: 10.5, letterSpacing: 0.6, color: "#6B7570", fontWeight: 700, borderBottom: "1px solid #E2DFD2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => {
              const days = daysUntil(d.expiration);
              const expired = days !== null && days < 0;
              const soon = days !== null && days >= 0 && days <= 90;
              return (
                <tr key={d.id} style={{ borderBottom: "1px solid #EEEBE0" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}><FileText size={13} style={{ marginRight: 6, verticalAlign: -2 }} color="#8B948E" />{d.name}</td>
                  <td style={{ padding: "10px 14px" }}><ProviderTag name={d.providerName} /></td>
                  <td className="mono" style={{ padding: "10px 14px", fontSize: 12 }}>{fmtDate(d.expiration)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {expired ? <span style={{ background: "#F7E7E1", color: "#B0492E", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>EXPIRED</span>
                      : soon ? <span style={{ background: "#FBF0DE", color: "#C98A2B", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>EXPIRES SOON</span>
                      : <span style={{ background: "#E9F1E9", color: "#4C7A52", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>CURRENT</span>}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    {isAdmin && <button onClick={() => onDelete(d.id)} style={{ background: "none", border: "none", color: "#B0AFA4" }}><Trash2 size={14} /></button>}
                  </td>
                </tr>
              );
            })}
            {documents.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#9BA79E" }}>No documents yet for this practice.</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd && <AddDocumentModal providerNames={providerNames} onClose={() => setShowAdd(false)} onSave={(doc) => { onAdd(doc); setShowAdd(false); }} />}
    </div>
  );
}

function AddDocumentModal({ onClose, onSave, providerNames }) {
  const [name, setName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [expiration, setExpiration] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(22,48,46,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div style={{ width: "min(400px, 92vw)", background: "#fff", borderRadius: 12, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="display" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Add document</h3>
          <button onClick={onClose} style={{ background: "none", border: "none" }}><X size={18} /></button>
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>DOCUMENT NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. PLI, DEA, State License" style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>PROVIDER</label>
          <input value={providerName} onChange={(e) => setProviderName(e.target.value)} list="doc-provider-suggestions" placeholder="e.g. Jane Doe, MD"
            style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
          <datalist id="doc-provider-suggestions">
            {providerNames.map((n) => <option key={n} value={n} />)}
          </datalist>
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="mono" style={{ fontSize: 10.5, color: "#8B948E" }}>EXPIRATION DATE</label>
          <input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} style={{ width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid #E2DFD2", borderRadius: 6, fontSize: 13 }} />
        </div>
        <button onClick={() => name.trim() && onSave({ name: name.trim(), providerName: providerName.trim() || "Group", expiration: expiration || null })} disabled={!name.trim()}
          style={{ marginTop: 20, width: "100%", padding: "10px", background: name.trim() ? "#2F6F6B" : "#D3D0C4", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
          Add document
        </button>
      </div>
    </div>
  );
}

function TeamPanel({ isAdmin }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: true })
      .then(({ data }) => { setMembers(data || []); setLoading(false); });
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Users size={16} color="#6B7570" />
        <p style={{ fontSize: 13, color: "#6B7570", margin: 0 }}>
          Everyone who signs in can view and edit applications across all practices. {isAdmin ? "As an admin, you can also delete entries and rename the tracker." : "Only admins can delete entries or rename the tracker."}
        </p>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 2px rgba(22,48,46,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F3F1E9", textAlign: "left" }}>
              {["Email", "Role", "Joined"].map((h) => (
                <th key={h} className="mono" style={{ padding: "10px 14px", fontSize: 10.5, letterSpacing: 0.6, color: "#6B7570", fontWeight: 700, borderBottom: "1px solid #E2DFD2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #EEEBE0" }}>
                <td style={{ padding: "10px 14px" }}>{m.email}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ background: m.role === "admin" ? "#FBF0DE" : "#EEF0F3", color: m.role === "admin" ? "#C98A2B" : "#7C879B", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{m.role}</span>
                </td>
                <td className="mono" style={{ padding: "10px 14px", fontSize: 12, color: "#6B7570" }}>{m.created_at ? fmtDate(m.created_at.slice(0,10)) : "\u2014"}</td>
              </tr>
            ))}
            {!loading && members.length === 0 && <tr><td colSpan={3} style={{ padding: 20, textAlign: "center", color: "#9BA79E" }}>No team members yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "#9BA79E", marginTop: 12 }}>
        To promote someone to admin, open the <code>profiles</code> table in your Supabase dashboard and change their <code>role</code> to <code>admin</code>.
      </p>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#16302E", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 13, zIndex: 100 }}>
      {message}
    </div>
  );
}

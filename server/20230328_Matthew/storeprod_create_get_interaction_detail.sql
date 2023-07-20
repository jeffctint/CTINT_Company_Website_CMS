SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[get_interaction_detail] (
	@interaction_id NVARCHAR(200),
	@result_code int OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
    SET @result_code = 0;

	select
		interaction.*,
		interaction.Id AS InteractionId,
		interaction.StrAttribute3 AS CaseId,
		CASE WHEN interaction.EndDate is null THEN 'In progress' ELSE 'Done' END AS Status,
		eIn.FromAddress,
		eOut.ToAddresses
	from
		dbo.Interaction interaction
	LEFT OUTER JOIN [dbo].[EmailIn] eIn ON eIn.Id = interaction.Id
	LEFT OUTER JOIN [dbo].[EmailOut] eOut ON eOut.Id = interaction.Id
	where interaction.Id = @interaction_id

	select doc.*, attachment.EntityId as attachmentEntityId from dbo.Document doc
	inner join dbo.Attachment attachment on attachment.DocumentId = doc.Id
	inner join dbo.Interaction interaction on interaction.Id = attachment.EntityId
	where interaction.Id = @interaction_id

	RETURN;
END;
GO
